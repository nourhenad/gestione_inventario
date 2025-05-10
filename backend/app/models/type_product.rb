require_relative '../../config/db'
require 'bcrypt'
require 'pg'

class TypeProduct
  def self.all
    DB.exec("SELECT * FROM tipi_prodotti")
  end

  def self.find(id)
    DB.exec_params("SELECT * FROM tipi_prodotti WHERE id = $1", [id]).first
  end

  def self.create(tipo)
    result = DB.exec_params("INSERT INTO tipi_prodotti (tipo) VALUES ($1) RETURNING id, tipo", [tipo]).first
    { id: result['id'], tipo: result['tipo'] }
  end

  def self.update(id, tipo)
    result = DB.exec_params("UPDATE tipi_prodotti SET tipo = $1 WHERE id = $2 RETURNING id, tipo", [tipo, id]).first
    result ? { id: result['id'], tipo: result['tipo'] } : nil
  end


  def self.delete(id)
    DB.exec_params("DELETE FROM tipi_prodotti WHERE id = $1", [id])
  end

end
