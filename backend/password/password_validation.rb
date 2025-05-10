class PasswordValidation
    def self.valid?(password)
     
      return false if password.length < 8
  
      
      return false unless password.match(/[A-Z]/)
  
      
      return false unless password.match(/[\W_]/)
      true
    end
  end
  