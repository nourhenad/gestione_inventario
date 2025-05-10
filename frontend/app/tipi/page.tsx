'use client';

import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/lib/auth';
import 'bootstrap-italia/dist/css/bootstrap-italia.min.css';

interface TipoProdotto {
  id: number;
  tipo: string;
}

export default function GestioneTipi() {
  const [tipi, setTipi] = useState<TipoProdotto[]>([]);
  const [form, setForm] = useState<{ tipo: string }>({ tipo: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errore, setErrore] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchTipi();
  }, []);

  const fetchTipi = async () => {
    const res = await fetch('http://localhost:4567/tipi', {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    if (res.ok) {
      const data = await res.json();
      setTipi(data);
      console.log('Tipi caricati:', data); 
    } else if (res.status === 401) {
      router.push('/login');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrore('');
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `http://localhost:4567/tipi/${editingId}`
      : 'http://localhost:4567/tipi';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ tipo: '' });
      setEditingId(null);
      fetchTipi();
    } else {
      const data = await res.json();
      setErrore(data.error || 'Errore nel salvataggio del tipo di prodotto');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Confermi l\'eliminazione del tipo di prodotto?')) return;

    const res = await fetch(`http://localhost:4567/tipi/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });

    if (res.ok) fetchTipi();
  };

  const handleEdit = (tipo: TipoProdotto) => {
    setEditingId(tipo.id);
    setForm({ tipo: tipo.tipo });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ProtectedRoute>
      <Navbar/>
    <div className="container my-5">
      <h1>Gestione Tipi di Prodotto</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <h4>{editingId ? 'Modifica Tipo di Prodotto' : 'Nuovo Tipo di Prodotto'}</h4>
        {errore && <div className="alert alert-danger">{errore}</div>}

        <div className="mb-3">
  <label htmlFor="nome" className="form-label">
    Nome Tipo
  </label>
  <input
    type="text"
    id="nome"
    name="nome"
    className="form-control"
    placeholder="Inserisci il nome del tipo"
    value={form.tipo}
    onChange={handleChange}
    required
  />
  <div className="invalid-feedback">Inserisci il nome del tipo.</div>
</div>


        <button className="btn btn-primary mt-3" type="submit">
          {editingId ? 'Salva Modifiche' : 'Aggiungi Tipo'}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn btn-secondary mt-3 ms-2"
            onClick={() => {
              setEditingId(null);
              setForm({ tipo: '' });
            }}
          >
            Annulla
          </button>
        )}
      </form>

      <h4>Lista Tipi di Prodotto</h4>
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {tipi.map((tipo) => (
            <tr key={tipo.id}>
              <td>{tipo.id}</td>
              <td>{tipo.tipo}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(tipo)}
                >
                  Modifica
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(tipo.id)}
                >
                  Elimina
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </ProtectedRoute>

  );
}
