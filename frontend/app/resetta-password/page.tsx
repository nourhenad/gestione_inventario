'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import Alert from '@/components/Alert'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setError('Token mancante!')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('Le password non corrispondono!')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('http://localhost:4567/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess('Password aggiornata con successo!')
        setError('')
        router.push('/login')
      } else {
        setError(data.error || 'Errore durante l\'aggiornamento della password.')
        setSuccess('')
      }
    } catch (err) {
      setError('Errore di rete. Riprova.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container my-5">
      <h2>Reset Password</h2>
      {error && <Alert message={error} type="danger" />}
      {success && <Alert message={success} type="success" />}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">Nuova Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Conferma Password</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Caricamento...' : 'Aggiorna Password'}
        </button>
      </form>
    </div>
  )
}
