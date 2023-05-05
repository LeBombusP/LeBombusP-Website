'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <NavigationMenu>
        <div className='flex flex-1 items-center justify-start space-x-2'>
          <Link href='/docs' legacyBehavior passHref>
            <a className='mr-6 flex items-center space-x-2'>
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
            <Link href='/docs' legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href='/docs' legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Projects</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href='/docs' legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Dashboard</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
        <div className='flex flex-1 items-center justify-end space-x-2'>
          <Link href='/docs' legacyBehavior passHref>
            <a className='mr-6 flex items-center space-x-2'>
              <Avatar>
                <AvatarImage src='icon2.svg' />
                <AvatarFallback>BP</AvatarFallback>
              </Avatar>
              <span className='hidden font-semibold sm:inline-block'>LeBombusP</span>
            </a>
          </Link>
        </div>
      </NavigationMenu>
    </main>
  );
}
