require 'sinatra/base'
require 'json'
require_relative '../../config/db'
require_relative '../services/jwt_service'
require 'bcrypt'
require 'sinatra/cross_origin'
require_relative '../models/user'
require_relative '../services/password_validation'



class UsersController < Sinatra::Base

  before do
    content_type :json
    pass if request.path_info == "/login"
    auth_header = request.env["HTTP_AUTHORIZATION"]
    halt 401, { error: "Token mancante" }.to_json unless auth_header

    token = auth_header.split(" ").last
    payload = JwtService.decode(token)
    halt 401, { error: "Token non valido" }.to_json unless payload
  end

  get '/users' do
    begin
      result = DB.exec("SELECT id, username, nome, cognome, data_nascita FROM utenti ORDER BY id")
      users = result.map { |row| row }
      users.to_json
    rescue => e
      puts " ERRORE SQL /users: #{e.message}"
      puts e.backtrace.join("\n")
      status 500
      { error: "Errore server interno" }.to_json
    end
  end

  
  post '/users' do
    data = JSON.parse(request.body.read)

    required = %w[username password nome cognome data_nascita email]
    missing = required.select { |f| data[f].nil? || data[f].strip.empty? }

    unless missing.empty?
      halt 400, { error: "Campi mancanti: #{missing.join(', ')}" }.to_json
    end

    unless data['email'] =~ /\A[^@\s]+@[^@\s]+\z/
      halt 400, { error: "Email non valida" }.to_json
    end

    unless data['data_nascita'] =~ /\A\d{4}-\d{2}-\d{2}\z/
      halt 400, { error: "Formato data non valido (YYYY-MM-DD)" }.to_json
    end

    unless PasswordValidation.valid?(data['password'])
      halt 400, { error: "La password deve contenere almeno 8 caratteri, una lettera maiuscola e un carattere speciale." }.to_json
    end

    if User.find_by_username(data['username'])
      halt 409, { error: "Username già esistente" }.to_json
    end

    if User.find_by_email(data['email'])
      halt 409, { error: "Email già registrata" }.to_json
    end

    password_hash = BCrypt::Password.create(data['password'])

    begin
      DB.exec_params(
        "INSERT INTO utenti (username, password_hash, nome, cognome, data_nascita, recovery_token, recovery_token_expiration, email)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [
          data['username'],
          password_hash,
          data['nome'],
          data['cognome'],
          data['data_nascita'],
          nil,
          nil,
          data['email']
        ]
      )
    rescue => e
      puts "Errore DB: #{e.class} - #{e.message}"
      puts e.backtrace.join("\n")
      halt 500, { error: "Errore interno: #{e.message}" }.to_json
    end

    status 201
    { message: "Utente creato con successo" }.to_json
  end

  
  put '/users/:id' do
    id = params['id']
    data = JSON.parse(request.body.read)

    if data['email'] && !(data['email'] =~ /\A[^@\s]+@[^@\s]+\z/)
      halt 400, { error: "Email non valida" }.to_json
    end

    if data['data_nascita'] && !(data['data_nascita'] =~ /\A\d{4}-\d{2}-\d{2}\z/)
      halt 400, { error: "Formato data non valido (YYYY-MM-DD)" }.to_json
    end

    fields = []
    values = []

    %w[nome cognome data_nascita email].each do |f|
      if data[f]
        fields << f
        values << data[f]
      end
    end

    if data['password']
      unless PasswordValidation.valid?(data['password'])
        halt 400, { error: "La password deve contenere almeno 8 caratteri, una lettera maiuscola e un carattere speciale." }.to_json
      end
      fields << 'password_hash'
      values << BCrypt::Password.create(data['password'])
    end

    if fields.empty?
      halt 400, { error: "Nessun campo da aggiornare" }.to_json
    end

    updates = fields.each_with_index.map { |f, i| "#{f} = $#{i + 1}" }.join(', ')
    values << id

    DB.exec_params(
      "UPDATE utenti SET #{updates} WHERE id = $#{values.length}",
      values
    )

    { message: "Utente aggiornato" }.to_json
  end

  
  delete '/users/:id' do
    id = params['id']
    DB.exec_params("DELETE FROM utenti WHERE id = $1", [id])
    { message: "Utente eliminato" }.to_json
  end
end
