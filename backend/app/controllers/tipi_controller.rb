# app/controllers/tipi_controller.rb
require 'json'
require 'sinatra/base'
require_relative '../models/type_product'
require_relative '../../config/db'
require_relative '../services/jwt_service'
require 'sinatra/cross_origin'

class TipiController < Sinatra::Base
  register Sinatra::CrossOrigin

  configure do
    enable :cross_origin
  end

  before do
    content_type :json
    auth_header = request.env["HTTP_AUTHORIZATION"]
    halt 401, { error: "Token mancante" }.to_json unless auth_header

    token = auth_header.split(" ").last
    payload = JwtService.decode(token)
    halt 401, { error: "Token non valido" }.to_json unless payload
  end

  get '/tipi' do
    tipi = TypeProduct.all
    tipi.to_a.to_json
  end

  get '/tipi/:id' do
    tipo = TypeProduct.find_by(id: params[:id])
    if tipo
      tipo.to_json
    else
      status 404
      { error: 'Tipo non trovato' }.to_json
    end
  end


  post '/tipi' do
    data = JSON.parse(request.body.read)
    tipo = data["tipo"]

    if ['Buste', 'Carta', 'Toner'].include?(tipo)
      nuovo_tipo = TypeProduct.create(tipo)
      nuovo_tipo.to_json
    else
      status 400
      { error: "Tipo di prodotto non valido" }.to_json
    end
  end


  put '/tipi/:id' do
    tipo = TypeProduct.find(params[:id])
    if tipo
      data = JSON.parse(request.body.read)
      nuovo_tipo = data["tipo"]

      
      if ['Buste', 'Carta', 'Toner'].include?(nuovo_tipo)
        tipo_aggiornato = TypeProduct.update(params[:id], nuovo_tipo)
        tipo_aggiornato.to_json
      else
        status 400
        { error: "Tipo di prodotto non valido" }.to_json
      end
    else
      status 404
      { error: "Tipo non trovato" }.to_json
    end
  end

  delete '/tipi/:id' do
    tipo = TypeProduct.find(params[:id])
    if tipo
      TypeProduct.delete(params[:id])
      status 200
      { message: "Tipo di prodotto eliminato con successo" }.to_json
    else
      status 404
      { error: "Tipo non trovato" }.to_json
    end
  end




end
