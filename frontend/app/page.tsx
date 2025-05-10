'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="container text-center my-5">
      <h1 className="mb-3">Benvenuto nell'app di Inventario</h1>
      <p className="mb-4">Accedi per gestire prodotti e tipi di prodotto.</p>
      <Link href="/login" className="btn btn-primary">
        Vai al Login
      </Link>
    </div>
  )
}
