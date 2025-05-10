
require 'sinatra/base'
require 'sinatra/cross_origin'
require 'json'
require 'bcrypt'
require 'securerandom'
require 'mail'
require_relative '../models/user'
require_relative '../services/jwt_service'
require_relative '../../config/db' 

  class AuthController < Sinatra::Base

    register Sinatra::CrossOrigin

    configure do
      enable :cross_origin
    end
  
    before do
      response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
      response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
      response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
      response.headers['Access-Control-Allow-Credentials'] = 'true'
    end
  
    options '*' do
      200
    end


    post '/login' do
      data = JSON.parse(request.body.read)
      username = data['username']
      password = data['password']
  
      if username.nil? || password.nil?
        status 400
        return { error: 'Username e password sono obbligatori' }.to_json
      end
  
      user = User.find_by_username(username)
  
      unless user && User.valid_password?(password, user['password_hash'])
        status 401
        return { error: 'Credenziali non valide' }.to_json
      end
  
      token = JwtService.encode({ user_id: user['id'], username: user['username'] })
  
      {
        message: 'Login riuscito',
        token: token
      }.to_json
    end
  

post '/logout' do
  response.delete_cookie('token')
  status 204
end


post '/recover-password' do
  begin
    data = JSON.parse(request.body.read)
    email = data['email']

    if email.nil? || email.strip.empty?
      status 400
      return { error: 'Email è obbligatoria' }.to_json
    end

    user = User.find_by_email(email)

    if user.nil?
      status 404
      return { error: 'Utente non trovato con questa email' }.to_json
    end

    recovery_token = SecureRandom.hex(16)
    expiration_time = Time.now + 3600

    User.save_recovery_token(user['id'], recovery_token, expiration_time)
    send_recovery_email(user, recovery_token)

    status 200
    { message: 'Un link di recupero è stato inviato alla tua email' }.to_json
  rescue => e
    puts "Errore durante il recupero password: #{e.message}"
    puts e.backtrace.join("\n")
    status 500
    { error: 'Errore interno del server, riprova più tardi' }.to_json
  end
end


post '/reset-password' do
  begin
    data = JSON.parse(request.body.read)
    token = data['token']
    new_password = data['password']

    if token.nil? || new_password.nil? || new_password.strip.empty?
      status 400
      return { error: 'Token e password sono obbligatori' }.to_json
    end

    user = User.find_by_recovery_token(token)

    if user.nil? || user['recovery_token_expiration'].nil? || Time.parse(user['recovery_token_expiration']) < Time.now
      status 400
      return { error: 'Token non valido o scaduto' }.to_json
    end

    password_hash = BCrypt::Password.create(new_password)
    User.update_password(user['id'], password_hash)
    User.clear_recovery_token(user['id'])

    status 200
    { message: 'Password reimpostata con successo' }.to_json
  rescue => e
    puts "Errore durante il reset password: #{e.message}"
    puts e.backtrace.join("\n")
    status 500
    { error: 'Errore interno del server, riprova più tardi' }.to_json
  end
end


require 'mail'

Mail.defaults do
  delivery_method :smtp, {
    address:              'smtp.mailtrap.io', # oppure smtp.gmail.com
    port:                 587,
    user_name:            'TUO_USERNAME',     # Mailtrap o Gmail
    password:             'TUA_PASSWORD',
    authentication:       :plain,
    enable_starttls_auto: true
  }
end


def send_recovery_email(user, token)
  email = user['email']
  link = "http://localhost:3000/recupera-password?token=#{token}"

  mail = Mail.new do
    from     'no-reply@tuodominio.com'
    to       email
    subject  'Recupero Password'
    body     "Ciao #{user['username']},\n\nHai richiesto il recupero della password.\nClicca sul seguente link per reimpostarla:\n\n#{link}\n\nIl link scade tra 1 ora."
  end

  mail.deliver!
  puts "[EMAIL INVIATA] Email inviata a #{email} con link di recupero."
end

end


