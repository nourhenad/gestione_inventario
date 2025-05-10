'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import 'bootstrap-italia/dist/css/bootstrap-italia.min.css'
import { setAuthToken } from '@/lib/auth'

export default function LoginPage() {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const res = await fetch('http://localhost:4567/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    })

    if (res.ok) {
      const data = await res.json()
      setAuthToken(data.token)
      router.push('/dashboard')
    } else {
      const data = await res.json()
      setError(data.error || 'Credenziali non valide')
    }
  }

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Accedi</h1>

      <form onSubmit={handleLogin} className="needs-validation" noValidate>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Inserisci il tuo username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <div className="invalid-feedback">Inserisci lo username.</div>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Inserisci la tua password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="invalid-feedback">Inserisci la password.</div>
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Accedi
        </button>
      </form>

      <div className="mt-3">
        <a href="/recupera-password">Hai dimenticato la password?</a>
      </div>
    </div>
  )
}
