require 'jwt'

class JwtService
  def self.encode(payload)
    JWT.encode(payload, ENV['JWT_SECRET'], 'HS256')
  end

  def self.decode(token)
    decoded = JWT.decode(token, ENV['JWT_SECRET'], true, { algorithm: 'HS256' })
    decoded[0] # ritorna il payload
  rescue
    nil
  end
end

