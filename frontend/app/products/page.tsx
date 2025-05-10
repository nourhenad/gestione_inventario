'use client'

import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthToken } from '@/lib/auth'
import 'bootstrap-italia/dist/css/bootstrap-italia.min.css'

interface TipoProdotto {
  id: number
  tipo: string
}

interface Prodotto {
  id: number
  nome_oggetto: string
  descrizione: string
  data_inserimento: string
  tipo_id: number
}

export default function GestioneProdotti() {
  const [prodotti, setProdotti] = useState<Prodotto[]>([])
  const [tipi, setTipi] = useState<TipoProdotto[]>([])
  const [form, setForm] = useState<{
    nome_oggetto: string
    descrizione: string
    data_inserimento: string
    tipo_id: number | ''
  }>({
    nome_oggetto: '',
    descrizione: '',
    data_inserimento: '',
    tipo_id: '',
  })
  
  
  const [editingId, setEditingId] = useState<number | null>(null)
  const [errore, setErrore] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchTipi()
    fetchProdotti()
  }, [])

  const fetchTipi = async () => {
    const res = await fetch('http://localhost:4567/tipi', {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    })
    if (res.ok) {
      const data = await res.json()
      setTipi(data)
    } else if (res.status === 401) {
      router.push('/login')
    }
  }

  const fetchProdotti = async () => {
    const res = await fetch('http://localhost:4567/products', {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    })
    if (res.ok) {
      const data = await res.json()
      setProdotti(data)
    } else if (res.status === 401) {
      router.push('/login')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'tipo_id' ? (value === '' ? '' : parseInt(value)) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrore('')
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId
      ? `http://localhost:4567/products/${editingId}`
      : 'http://localhost:4567/products'

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      setForm({ nome_oggetto: '', descrizione: '', data_inserimento: '', tipo_id: '' })
      setEditingId(null)
      fetchProdotti()
    } else {
      const data = await res.json()
      setErrore(data.error || 'Errore salvataggio prodotto')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Confermi eliminazione prodotto?')) return

    const res = await fetch(`http://localhost:4567/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    })

    if (res.ok) fetchProdotti()
  }

  const handleEdit = (prodotto: Prodotto) => {
    setEditingId(prodotto.id)
    setForm({
      nome_oggetto: prodotto.nome_oggetto,
      descrizione: prodotto.descrizione,
      data_inserimento: prodotto.data_inserimento,
      tipo_id: prodotto.tipo_id,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const nomeTipo = (id: number) => tipi.find((t) => t.id === id)?.tipo || '—'

  return (
    <ProtectedRoute>
        <Navbar/>
    <div className="container my-5">
      <h1>Gestione Inventario</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <h4>{editingId ? 'Modifica Prodotto' : 'Nuovo Prodotto'}</h4>
        {errore && <div className="alert alert-danger">{errore}</div>}
<div className="form-floating mb-3">
  <input
    type="text"
    className="form-control"
    id="nome_oggetto"
    name="nome_oggetto"
    value={form.nome_oggetto}
    onChange={handleChange}
    required
  />
  <label htmlFor="nome_oggetto">nome_oggetto</label>
</div>

        
        <div className="form-floating mb-3">
  <input
    type="text"
    className="form-control"
    id="descrizione"
    name="descrizione"
    value={form.descrizione}
    onChange={handleChange}
    required
  />
  <label htmlFor="descrizione">Descrizione</label>
</div>


<div className="form-floating mb-3">
  <input
    type="date"
    className="form-control"
    id="data_inserimento"
    name="data_inserimento"
    value={form.data_inserimento}
    onChange={handleChange}
    required
  />
  <label htmlFor="data_inserimento">Data Inserimento</label>
</div>
<div className="form-floating mb-3">
  <select
  className="form-select"
    id="tipo_id"
     name="tipo_id"
    value={form.tipo_id}
    onChange={handleChange}
    required
  >
    <option value="">Seleziona tipo</option>
    {tipi.map((tipo) => (
      <option key={tipo.id} value={tipo.id}>
        {tipo.tipo} 
      </option>
    ))}
  </select>
  <label htmlFor="tipo_id">Tipo Prodotto</label>
</div>

        <button className="btn btn-primary mt-3" type="submit">
          {editingId ? 'Salva Modifiche' : 'Aggiungi Prodotto'}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn btn-secondary mt-3 ms-2"
            onClick={() => {
              setEditingId(null)
              setForm({ nome_oggetto: '', descrizione: '', data_inserimento: '', tipo_id: 0 })
            }}
          >
            Annulla
          </button>
        )}
      </form>

      <h4>Lista Prodotti</h4>
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrizione</th>
            <th>Data Inserimento</th>
            <th>Tipo</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {prodotti.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nome_oggetto}</td>
              <td>{p.descrizione}</td>
              <td>{p.data_inserimento}</td>
              <td>{nomeTipo(p.tipo_id)}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(p)}>
                  Modifica
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>
                  Elimina
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </ProtectedRoute>
  
  )

}
