require 'pg'
require 'dotenv/load'
require 'active_record'

begin
DB = PG.connect(
  dbname: ENV['DB_NAME'] || 'inventario_negozio',
  user: ENV['DB_USER'] || 'postgres',
  password: ENV['DB_PASSWORD'] || 'abdellaoui98',
  host: ENV['DB_HOST'] || 'localhost',
  port: ENV['DB_PORT'] || 5432
)
puts "✅ DB connesso"
rescue PG::Error => e
  puts "❌ Errore connessione DB: #{e.message}"
  exit
end



begin
  ActiveRecord::Base.establish_connection(
    adapter: 'postgresql',
    database: ENV['DB_NAME'] || 'inventario_negozio',
    username: ENV['DB_USER'] || 'postgres',
    password: ENV['DB_PASSWORD'] || 'abdellaoui98',
    host: ENV['DB_HOST'] || 'localhost',
    port: ENV['DB_PORT'] || 5432
  )
  puts "✅ ActiveRecord connesso"
rescue StandardError => e
  puts "❌ Errore ActiveRecord: #{e.message}"
  exit
end
