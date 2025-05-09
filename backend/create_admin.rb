require 'bcrypt'
require 'pg'
require 'dotenv/load'

# Funzione per cifrare la password
def hash_password(password)
  BCrypt::Password.create(password)
end

# Connessione al database
def db_connection
  PG.connect(ENV['DATABASE_URL'])
end


def create_admin_user
  # Dati dell'utente admin
  username = 'admin'
  password = 'Admin123@'  
  nome = 'Admin'
  cognome = 'User'
  data_nascita = '1980-01-01'
  email = 'admin@example.com'

  # Cifra la password
  hashed_password = hash_password(password)

  # Connessione al DB
  conn = db_connection

  # Verifica se l'utente esiste già
  result = conn.exec_params("SELECT * FROM utenti WHERE username = $1 LIMIT 1", [username])

  if result.ntuples > 0
    puts "L'utente '#{username}' esiste già!"
    return
  end

  # Inserisci l'utente nel DB
  conn.exec_params("INSERT INTO utenti (username, password_hash, nome, cognome, data_nascita,email)
                    VALUES ($1, $2, $3, $4, $5,$6)", [username, hashed_password, nome, cognome, data_nascita,email])

  puts "Utente '#{username}' creato con successo!"
end

# Crea l'utente
create_admin_user
