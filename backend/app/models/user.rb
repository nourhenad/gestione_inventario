require 'bcrypt'
require 'pg'
require_relative '../../config/db'

class User
  def self.find_by_username(username)
    result = DB.exec_params("SELECT * FROM utenti WHERE username = $1 LIMIT 1", [username])
    result.first
  end

  def self.find_by_email(email)
    result = DB.exec_params("SELECT * FROM utenti WHERE email = $1 LIMIT 1", [email])
    result.first
  end

  def self.valid_password?(password, password_hash)
    BCrypt::Password.new(password_hash) == password
  end

  def self.save_recovery_token(user_id, token, expiration)
    DB.exec_params(
      "UPDATE utenti SET recovery_token = $1, recovery_token_expiration = $2 WHERE id = $3",
      [token, expiration, user_id]
    )
  end

  def self.find_by_recovery_token(token)
    result = DB.exec_params("SELECT * FROM utenti WHERE recovery_token = $1 LIMIT 1", [token])
    result.first
  end

  def self.update_password(user_id, new_password_hash)
    DB.exec_params(
      "UPDATE utenti SET password_hash = $1 WHERE id = $2",
      [new_password_hash, user_id]
    )
  end

  def self.clear_recovery_token(user_id)
    DB.exec_params(
      "UPDATE utenti SET recovery_token = NULL, recovery_token_expiration = NULL WHERE id = $1",
      [user_id]
    )
  end
end
