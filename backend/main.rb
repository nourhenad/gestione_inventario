require 'sinatra'
require 'sinatra/json'
require 'sinatra/cross_origin'
require 'pg'
require 'dotenv/load'

require_relative './app/controllers/auth_controller'
require_relative './app/controllers/users_controller'
require_relative './app/controllers/products_controller'
require_relative './app/services/password_validation'
require_relative './app/controllers/tipi_controller'


configure do
  enable :cross_origin
end

before do
  content_type :json
end
require 'sinatra'
require 'sinatra/json'
require 'sinatra/cross_origin'
require 'dotenv/load'

require_relative './app/controllers/auth_controller'
require_relative './app/controllers/users_controller'
require_relative './app/controllers/products_controller'

configure do
  enable :cross_origin
end

before do
  response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
  response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
  response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Token'
end

options '*' do
  200
end

use AuthController
use UsersController
use ProductsController
use TipiController

# Avvia il server sulla porta 4567 (default)
set :bind, '0.0.0.0'
set :port, 4567
