class PasswordValidation
    def self.valid?(password)
      # La password deve avere almeno 8 caratteri
      return false if password.length < 8
  
      # La password deve contenere almeno una lettera maiuscola
      return false unless password.match(/[A-Z]/)
  
      # La password deve contenere almeno un carattere speciale
      return false unless password.match(/[\W_]/)
      true
    end
  end
  