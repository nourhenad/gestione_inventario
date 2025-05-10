'use client'

import { useState } from 'react'
import 'bootstrap-italia/dist/css/bootstrap-italia.min.css'

export default function RecuperaPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    const res = await fetch('http://localhost:4567/recupera-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (res.ok) {
      setMessage('Email inviata con le istruzioni per il recupero.')
    } else {
      const data = await res.json()
      setError(data.error || 'Errore durante l’invio dell’email.')
    }
  }

  return (
    <div className="container my-5">
      <h1 className="text-center">Recupera Password</h1>
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        {message && (
          <div className="alert alert-success" role="alert">
            {message}
          </div>
        )}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <div className="form-group">
          <label htmlFor="email">Inserisci la tua email</label>
          <input
            className="form-control"
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="invalid-feedback">Email richiesta</div>
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Invia richiesta
        </button>
      </form>
      <div className="mt-3">
        <a href="/login">Torna al login</a>
      </div>
    </div>
  )
}
