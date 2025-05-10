'use client';

import { useRouter } from 'next/navigation';
import { deleteAuthToken } from '@/lib/auth';
import Link from 'next/link';
import 'bootstrap-italia/dist/css/bootstrap-italia.min.css';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    deleteAuthToken();
    router.push('/login');
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" href="/dashboard">Dashboard</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" href="/products">Prodotti</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/tipi">Tipi di Prodotto</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/users">Utenti</Link>
              </li>
            </ul>
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Contenuto pagina */}
      <div className="container my-5">
        <h1>Benvenuto nella dashboard</h1>
        <p className="mb-4">Scegli una sezione da gestire:</p>

        <div className="row">
          <div className="col-md-4 mb-3">
            <Link href="/products" className="card text-decoration-none text-dark h-100">
              <div className="card-body">
                <h5 className="card-title">Prodotti</h5>
                <p className="card-text">Gestisci l'inventario dei prodotti.</p>
              </div>
            </Link>
          </div>
          <div className="col-md-4 mb-3">
            <Link href="/tipi" className="card text-decoration-none text-dark h-100">
              <div className="card-body">
                <h5 className="card-title">Tipi di Prodotto</h5>
                <p className="card-text">Organizza i tipi di prodotto disponibili.</p>
              </div>
            </Link>
          </div>
          <div className="col-md-4 mb-3">
            <Link href="/users" className="card text-decoration-none text-dark h-100">
              <div className="card-body">
                <h5 className="card-title">Utenti</h5>
                <p className="card-text">Amministra gli utenti della piattaforma.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
