require 'pg'
require 'bcrypt'

conn = PG.connect(
  dbname: 'inventario_negozio',
  user: 'postgres',
  password: 'abdellaoui98',
  host: 'localhost'
)



password_hash = BCrypt::Password.create('Password123!')
conn.exec_params("INSERT INTO utenti (username, password_hash, nome, cognome, data_nascita, email) 
                  VALUES ($1, $2, $3, $4, $5, $6)", 
  ['admin', password_hash, 'Admin', 'User', '1980-01-01', 'admin@email.com'])


tipi = ['Buste', 'Carta', 'Toner']
tipi.each do |tipo|
  conn.exec_params("INSERT INTO tipi_prodotti (tipo) VALUES ($1) ON CONFLICT DO NOTHING", [tipo])
end

puts "Dati iniziali inseriti con successo."
