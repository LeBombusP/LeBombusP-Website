'use client';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();

  const loginPasswordless = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const response = await fetch('/api/passwordless', {
      method: 'POST',
      body: JSON.stringify({
        email,
      }),
    });
    //inform user about email
  };
  const loginCredentials = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const remember = formData.get('remember') !== null;
    const response = await fetch('/api/credentials', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
        remember,
      }),
    });

    const data = await response.json();
    if (response.status === 200) {
      Cookies.set('jwt', data.jwt, { expires: data.time, path: '/' });
      return router.push('/dashboard');
    }
    return alert(data.error);
  };
  return (
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
            <CardContent className='space-y-4'>
              <div className='space-y-1'>
                <Label htmlFor='username'>Username</Label>
                <Input required name='username' id='username' placeholder='David Nowotny' />
              </div>
              <div className='space-y-1'>
                <Label htmlFor='password'>Password</Label>
                <Input required type='password' id='password' name='password' placeholder='••••••••' />
              </div>
              <div className='flex items-center'>
                <Checkbox id='remember' name='remember' />
                <label htmlFor='remember' className='text-sm ml-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                  Remember me!
                </label>
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
          <form onSubmit={loginPasswordless}>
            <CardHeader>
              <CardTitle className='m-auto'>Email (passwordless)</CardTitle>
              <CardDescription className='m-auto'>Submit your email and we will send you link to log in.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='space-y-1'>
                <Label htmlFor='email'>Email</Label>
                <Input required type='email' id='email' name='email' placeholder='nowotny@mail.com' />
              </div>
            </CardContent>
            <CardFooter>
              <Button className='m-auto'>Log in via email</Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
      <div className='w-full mt-2 inline-flex h-10 items-center justify-evenly rounded-md border-4 border-muted p-1 text-card-foreground'>
        <AlertDialog>
          <AlertDialogTrigger className='font-medium text-sm'>Forgot password?</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Well sh*t!</AlertDialogTitle>
              <AlertDialogDescription>
                If you have forgotten your username or password you can still log in via email and vice versa then change your credentials in the dashboard.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Sure</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Separator orientation='vertical' />
        <Link className='font-medium text-sm' href='/signin'>
          Dont have an account?
        </Link>
      </div>
    </Tabs>
  );
}
