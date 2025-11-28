'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'

const Navbar = () => {

  const { data: session } = useSession();
  const user: User = session?.user as User;


  return (
    <nav className='bg-[#EFF5F5] h-[10vh] p-4 md:p-6 shadow-md flex justify-center'>
      <div className='container mx-auto md:mx-24 flex flex-row justify-between'>
        <a className='text-xl md:text-2xl font-bold mb-4 md:mb-0 font-serif' href="#">Ghost Feedback</a>
        {
          session ? (
            <>
              <Button className='w-fit' onClick={() => signOut({ callbackUrl: "/sign-in" })}>Logout</Button>
            </>
          ) : (
            <div className='font-bold text-[#2d3337] text-md flex gap-4 md:gap-10 align-center'>
              <Link href={'/sign-in'}>
                <p className='w-fit'>Login</p>
              </Link>
              <Link href={'/sign-up'}>
                <p className='w-fit'>Register</p>
              </Link>
            </div>
          )
        }
      </div>
    </nav>
  )
}

export default Navbar
