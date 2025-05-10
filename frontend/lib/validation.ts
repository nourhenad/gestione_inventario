export function validatePasswordAgid(password: string): boolean {
    const lengthValid = password.length >= 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password)
    return lengthValid && hasUppercase && hasSpecialChar
  }
  