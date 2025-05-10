import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value


  if (!token && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

 
  if (token && !await isValidToken(token)) {
 
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

const isValidToken = async (token: string) => {
  try {
    const response = await fetch('http://localhost:4567/validate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })

    if (response.ok) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error('Errore durante la validazione del token', error)
    return false
  }
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|login|recupera-password).*)'],
}
