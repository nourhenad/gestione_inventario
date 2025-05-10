'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteAuthToken } from '@/lib/auth';
import { useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    deleteAuthToken();
  
    setTimeout(() => {
      router.push('/login');
    }, 500);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div className="container-fluid">
      <Link className="navbar-brand" href="/dashboard">Inventario App</Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" href="/users">Utenti</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/products">Prodotti</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/tipi">Tipi</Link>
            </li>
          </ul>
          <button
            className="btn btn-outline-danger"
            onClick={handleLogout}
            disabled={isLoggingOut} 
          >
            {isLoggingOut ? 'Logout in corso...' : 'Logout'}
          </button>
        </div>
      </div>
    </nav>
  );
}
