'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { IconBrandGithub, IconMoon, IconSun } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [dark, setDark] = useState(true);
  const changeTheme = () => {
    setDark(!dark);
    document.body.classList.toggle('dark');
  };
  return (
    <header className='supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 shadow-sm backdrop-blur'>
      <NavigationMenu>
        <div className='flex flex-1 items-center justify-start space-x-2 px-4 py-1'>
          <Link href='/' legacyBehavior passHref>
            <a className='flex items-center space-x-2'>
              <Avatar>
                <AvatarImage src='icon2.svg' />
                <AvatarFallback>BP</AvatarFallback>
              </Avatar>
              <span className='hidden font-semibold sm:inline-block'>LeBombusP</span>
            </a>
          </Link>
        </div>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href='/' legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href='/projects' legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Projects</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link prefetch={false} href='/dashboard' legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Dashboard</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
        <div className='flex flex-1 items-center justify-end space-x-2 px-4'>
          <a href='https://github.com/LeBombusP' target='_blank' className='mr-2 md:mr-6 flex items-center space-x-2'>
            <IconBrandGithub color={dark ? 'white' : 'black'} size={18} />
          </a>
          <button type='button' onClick={changeTheme}>
            {dark ? <IconMoon color='white' size={18} /> : <IconSun color='black' size={18} />}
          </button>
        </div>
      </NavigationMenu>
    </header>
  );
}
