
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation';

export const logout = (router: any) => {
    deleteAuthToken(); 
    router.push('/login');
  };


export const setAuthToken = (token: string): void => {
  Cookies.set('token', token, { expires: 1 }) 
}

export const getAuthToken = (): string | undefined => {
  return Cookies.get('token')
}

export const deleteAuthToken = (): void => {
  Cookies.remove('token')
}
