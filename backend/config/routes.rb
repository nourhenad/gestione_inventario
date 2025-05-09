require 'sinatra'
require_relative '../controllers/auth_controller'
require_relative '../controllers/users_controller'
require_relative '../controllers/products_controller'

use AuthController
use UsersController
use ProducstController