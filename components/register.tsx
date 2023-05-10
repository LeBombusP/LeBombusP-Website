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
import { useToast } from '@/components/ui/use-toast';
import { post } from '@/lib/fetch';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const repeat = formData.get('repeat') as string;

    const { data, status } = await post('./signin', {
      username,
      email,
      password,
      repeat,
    });

    if (status === 200) {
      Cookies.set('jwt', data.jwt, { expires: data.time, path: '/' });
      return router.push('/dashboard');
    }
    return toast({
      variant: 'destructive',
      title: 'Error!',
      description: data.error,
    });
  };

  return (
    <div className='grid grid-cols-1 grid-rows-[90vh] items-center justify-items-center'>
      <div className='w-[400px]'>
        <Card>
          <form onSubmit={handleRegister}>
            <CardHeader>
              <CardTitle className='m-auto'>Hello there!</CardTitle>
              <CardDescription className='m-auto'>Create your account to acces the dashboard.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-1'>
                <Label htmlFor='username'>Username</Label>
                <Input required name='username' id='username' placeholder='David Nowotny' />
              </div>
              <div className='space-y-1'>
                <Label htmlFor='email'>Email</Label>
                <Input required type='email' name='email' id='email' placeholder='nowotny@mail.com' />
              </div>
              <div className='space-y-1'>
                <Label htmlFor='password'>Password</Label>
                <Input required type='password' id='password' name='password' placeholder='••••••••' />
              </div>
              <div className='space-y-1'>
                <Label htmlFor='repeat'>Repeat password</Label>
                <Input required type='password' id='repeat' name='repeat' placeholder='••••••••' />
              </div>
              <div className='flex items-center'>
                <Checkbox id='tos' required />
                <label htmlFor='tos' className='text-sm ml-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                  I agree to the terms of service
                </label>
              </div>
            </CardContent>
            <CardFooter>
              <Button className='m-auto'>Create account</Button>
            </CardFooter>
          </form>
        </Card>

        <div className='w-full mt-2 inline-flex h-10 items-center justify-evenly rounded-md border-4 border-muted p-1 text-card-foreground'>
          <AlertDialog>
            <AlertDialogTrigger className='font-medium text-sm'>Why cant I sign up?</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Why cant I sign up??!!</AlertDialogTitle>
                <AlertDialogDescription>
                  Making sign up functionality would held me resonsible under EU law if i would suffer data leak, and because i cannot trust my garbage code
                  dashboard will be only avalible for me.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>What a shame</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Separator orientation='vertical' />
          <Link className='font-medium text-sm' href='/login'>
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
}
