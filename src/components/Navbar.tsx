'use client'
import Link from 'next/link'
import { useSession} from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'

const Navbar = () => {

  const {data: session} = useSession();
  const user: User = session?.user as User;


  return (
    <nav className='h-[10vh] p-4 md:p-6 shadow-md'>
      <div className='container mx-auto flex flex-row justify-between items-center'>
        <a className='text-xl font-bold mb-4 md:mb-0' href="#">Ghost Feedback</a>
        {
          session ? (
            <Link href={"/"}>
              <Button className='w-fit'>Logout</Button>
            </Link>
          ): (
            <Link href={'/sign-in'}>
              <Button className='w-fit'>Login</Button>
            </Link>
          )
        }
      </div>
    </nav>
  )
}

export default Navbar
