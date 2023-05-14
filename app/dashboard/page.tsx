'use client'
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const logout = () => {
    Cookies.remove('jwt', { path: '' })
    router.push('/')
  }
  return (
    <main>
      <p>Dashboard</p>
      <button onClick={logout}>Logout</button>
    </main>
  );
}
