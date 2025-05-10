import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-italia/dist/css/bootstrap-italia.min.css';
import 'bootstrap-italia/dist/js/bootstrap-italia.bundle.min.js';
import '../styles/globals.css';

export const metadata = {
  title: 'Gestione Inventario',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}

