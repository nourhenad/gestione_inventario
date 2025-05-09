

module PasswordValidation
    def self.valid?(password)
      return false if password.nil?
      password.length >= 8 &&
        password.match(/[a-z]/) &&
        password.match(/[A-Z]/) &&
        password.match(/\d/) &&
        password.match(/[\W_]/) # simboli speciali
    end
  end
  