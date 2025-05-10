'use client'

import Navbar from '@/components/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'
import 'bootstrap-italia/dist/css/bootstrap-italia.min.css'

interface Utente {
  id: number
  username: string
  nome: string
  cognome: string
  data_nascita: string
  email: string
  password: string 
}

export default function GestioneUtenti() {
  const [utenti, setUtenti] = useState<Utente[]>([])
  const [form, setForm] = useState<Omit<Utente, 'id'>>({
    username: '',
    nome: '',
    cognome: '',
    data_nascita: '',
    email: '',
    password: '',
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [errore, setErrore] = useState('')
  const router = useRouter()

  const fetchUtenti = async () => {
    try {
      const data = await apiFetch('/users')
      setUtenti(data)
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
        router.push('/login')
      } else {
        setErrore(err.message)
      }
    }
  }

  useEffect(() => {
    fetchUtenti()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrore('')
    const method = editingId ? 'PUT' : 'POST'
    const path = editingId ? `/users/${editingId}` : '/users'

    try {
      await apiFetch(path, method, form)
      setForm({ username: '', nome: '', cognome: '', data_nascita: '', email: '', password: '' }) 
      setEditingId(null)
      fetchUtenti()
    } catch (err: any) {
      setErrore(err.message)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Sei sicuro di voler eliminare questo utente?')) return

    try {
      await apiFetch(`/users/${id}`, 'DELETE')
      fetchUtenti()
    } catch (err: any) {
      setErrore(err.message)
    }
  }

  const handleEdit = (utente: Utente) => {
    setEditingId(utente.id)
    setForm({
      username: utente.username,
      nome: utente.nome,
      cognome: utente.cognome,
      data_nascita: utente.data_nascita,
      email: utente.email,
      password: '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <ProtectedRoute>
    <Navbar />
    <div className="container my-5">
      <h1>Gestione Utenti</h1>
  
      <form onSubmit={handleSubmit} className="mb-4">
        <h4>{editingId ? 'Modifica Utente' : 'Nuovo Utente'}</h4>
        {errore && <div className="alert alert-danger">{errore}</div>}
  
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="form-floating">
              <input
                id="username"
                name="username"
                type="text"
                className="form-control"
                value={form.username}
                onChange={handleChange}
                required
              />
              <label htmlFor="username">Username</label>
            </div>
          </div>
  
          <div className="col-md-6">
            <div className="form-floating">
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                required={editingId === null} 
              />
              <label htmlFor="password">Password</label>
            </div>
          </div>
        </div>
  
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="form-floating">
              <input
                id="nome"
                name="nome"
                type="text"
                className="form-control"
                value={form.nome}
                onChange={handleChange}
                required
              />
              <label htmlFor="nome">Nome</label>
            </div>
          </div>
  
          <div className="col-md-6">
            <div className="form-floating">
              <input
                id="cognome"
                name="cognome"
                type="text"
                className="form-control"
                value={form.cognome}
                onChange={handleChange}
                required
              />
              <label htmlFor="cognome">Cognome</label>
            </div>
          </div>
        </div>
  
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="form-floating">
              <input
                type="date"
                id="data_nascita"
                name="data_nascita"
                className="form-control"
                value={form.data_nascita}
                onChange={handleChange}
                required
              />
              <label htmlFor="data_nascita">Data di Nascita</label>
            </div>
          </div>
  
          <div className="col-md-6">
            <div className="form-floating">
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                required
              />
              <label htmlFor="email">Email</label>
            </div>
          </div>
        </div>
  
        <button className="btn btn-primary mt-3" type="submit">
          {editingId ? 'Salva Modifiche' : 'Aggiungi Utente'}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn btn-secondary mt-3 ms-2"
            onClick={() => {
              setEditingId(null)
              setForm({ username: '', nome: '', cognome: '', data_nascita: '', email: '', password: '' })
            }}
          >
            Annulla
          </button>
        )}
      </form>
  
      <h4>Lista Utenti</h4>
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Password</th> 
            <th>Nome</th>
            <th>Cognome</th>
            <th>Data Nascita</th>
            <th>Email</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {utenti.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>******</td> 
              <td>{u.nome}</td>
              <td>{u.cognome}</td>
              <td>{u.data_nascita}</td>
              <td>{u.email}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(u)}>
                  Modifica
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.id)}>
                  Elimina
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </ProtectedRoute>
  )}  