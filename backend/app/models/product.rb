require_relative '../../config/db'
require 'bcrypt'
require 'pg'

class Product
  def self.all
    DB.exec("SELECT * FROM prodotti")
  end

  def self.find(id)
    DB.exec_params("SELECT * FROM prodotti WHERE id = $1", [id]).first
  end

  def self.create(params)
    DB.exec_params(
      "INSERT INTO prodotti (nome_oggetto, descrizione, data_inserimento, tipo_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [params['nome_oggetto'], params['descrizione'], params['data_inserimento'], params['tipo_id']]
    ).first
  end

  def self.update(id, params)
    DB.exec_params(
      "UPDATE prodotti SET nome_oggetto = $1, descrizione = $2, data_inserimento = $3, tipo_id = $4 WHERE id = $5 RETURNING *",
      [params['nome_oggetto'], params['descrizione'], params['data_inserimento'], params['tipo_id'], id]
    ).first
  end

  def self.delete(id)
    DB.exec_params("DELETE FROM prodotti WHERE id = $1", [id])
  end
end
