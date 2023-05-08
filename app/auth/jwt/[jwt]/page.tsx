'use client';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

export default function Page({ params }) {
  const router = useRouter();
  useEffect(() => {
    if (params.jwt) {
      localStorage.setItem('jwt', params.jwt);
      Cookies.set('jwt', params.jwt, { expires: 1, path: '/' });
    }
    router.push('/dashboard');
  }, [params.jwt, router]);
}
