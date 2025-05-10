export default function Alert({ message, type }: { message: string; type?: string }) {
  return (
    <div className={`alert alert-${type || 'danger'} mt-3`} role="alert">
      {message}
    </div>
  )
}

