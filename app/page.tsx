'use client';
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import router from 'next/router';

export default function Home() {
  const loginCredentials = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const response = await fetch('/api/credentials', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
    });
    if (response.status === 200) {
      return router.push('/dashboard');
    }
    if (response.status === 401) {
      return alert('Invalid credentials');
    }
    if (response.status === 500) {
      return alert('Server error');
    }
  };
  return (
    <main>
      <Navbar />
      <Tabs defaultValue='account' className='w-[400px] absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='account'>Username/Password</TabsTrigger>
          <TabsTrigger value='password'>Email (passwordless)</TabsTrigger>
        </TabsList>
        <TabsContent value='account'>
          <Card>
            <form onSubmit={loginCredentials}>
              <CardHeader>
                <CardTitle className='m-auto'>Username/Password</CardTitle>
                <CardDescription className='m-auto'>Log in here with username and password.</CardDescription>
              </CardHeader>
              <CardContent className='space-y-2'>
                <div className='space-y-1'>
                  <Label htmlFor='username'>Username</Label>
                  <Input name='username' placeholder='David Nowotny' />
                </div>
                <div className='space-y-1'>
                  <Label htmlFor='password'>Password</Label>
                  <Input type='password' name='password' placeholder='••••••••' />
                </div>
              </CardContent>
              <CardFooter>
                <Button className='m-auto'>Log in with credentials</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value='password'>
          <Card>
            <form>
              <CardHeader>
                <CardTitle className='m-auto'>Email (passwordless)</CardTitle>
                <CardDescription className='m-auto'>Submit your email and we will send you link to log in.</CardDescription>
              </CardHeader>
              <CardContent className='space-y-2'>
                <div className='space-y-1'>
                  <Label htmlFor='email'>Email</Label>
                  <Input type='email' name='email' placeholder='nowotny@mail.com' />
                </div>
              </CardContent>
              <CardFooter>
                <Button className='m-auto'>Log in via email</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
