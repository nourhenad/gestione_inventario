require 'sinatra/base'
require 'json'
require_relative '../../config/db'
require_relative '../services/jwt_service'
require_relative '../models/product'
require 'sinatra/cross_origin'


class ProductsController < Sinatra::Base
  register Sinatra::CrossOrigin

  configure do
    enable :cross_origin
    set :allow_origin, :any
    set :allow_methods, [:get, :post, :put, :delete, :options]
    set :allow_headers, ['*']
    set :expose_headers, ['Content-Type']
  end

  
  options '*' do
    response.headers['Allow'] = 'HEAD,GET,POST,PUT,DELETE,OPTIONS'
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    200
  end


  before do
    content_type :json
    pass if request.path_info == "/tipi"

    auth_header = request.env["HTTP_AUTHORIZATION"]
    halt 401, { error: "Token mancante" }.to_json unless auth_header

    token = auth_header.split(" ").last
    payload = JwtService.decode(token)
    halt 401, { error: "Token non valido" }.to_json unless payload
  end

get '/products' do
  begin
    result = DB.exec(
      "SELECT p.id, p.nome_oggetto, p.descrizione, p.data_inserimento,
              t.tipo AS tipi_prodotti 
       FROM prodotti p
       JOIN tipi_prodotti t ON p.tipo_id = t.id
       ORDER BY p.id"
    )

    result.map(&:to_h).to_json
  rescue => e
    puts "Errore GET /products: #{e.class} - #{e.message}"
    status 500
    { error: "Errore interno: #{e.message}" }.to_json
  end
end


  post '/products' do
    data = JSON.parse(request.body.read)

    required = %w[nome_oggetto descrizione tipo_id]
    missing = required.select do |f|
        value = data[f]
        value.nil? || (value.is_a?(String) && value.strip.empty?)
      end
      

    unless missing.empty?
      halt 400, { error: "Campi mancanti: #{missing.join(', ')}" }.to_json
    end

    tipo_id_exists = DB.exec_params("SELECT 1 FROM tipi_prodotti WHERE id = $1", [data['tipo_id']]).count > 0
  unless tipo_id_exists
    halt 400, { error: "Tipo di prodotto non valido" }.to_json
  end
    
    data_inserimento = Time.now.strftime('%Y-%m-%d %H:%M:%S')
   
   
    DB.exec_params(
      "INSERT INTO prodotti (nome_oggetto, descrizione, tipo_id)
       VALUES ($1, $2, $3)",
      [data['nome_oggetto'], data['descrizione'], data['tipo_id']]
    )

    status 201
    { message: "Prodotto inserito" }.to_json
  end


  put '/products/:id' do
    id = params['id']
    data = JSON.parse(request.body.read)

    DB.exec_params(
      "UPDATE prodotti
       SET nome_oggetto = $1, descrizione = $2, tipo_id = $3
       WHERE id = $4",
      [data['nome_oggetto'], data['descrizione'], data['tipo_id'], id]
    )

    { message: "Prodotto aggiornato" }.to_json
  end

  
  delete '/products/:id' do
    id = params['id']
    DB.exec_params("DELETE FROM prodotti WHERE id = $1", [id])
    { message: "Prodotto eliminato" }.to_json
  end

 
  get '/product-types' do
    result = DB.exec("SELECT * FROM tipi_prodotti ORDER BY id")
    result.map(&:to_h).to_json
  end
end
