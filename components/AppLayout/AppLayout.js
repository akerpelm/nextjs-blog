import { useUser } from '@auth0/nextjs-auth0/client';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '../Logo';

export const AppLayout = ({ children }) => {
  const { user } = useUser();

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className=" flex flex-col text-white overflow-hidden bg-slate-800">
        <div className>
          <Logo />
          <Link href="/posts/new" className="btn">
            New Post
          </Link>
          <Link href="/token-refill" className="block mt-2 text-center">
            <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />{' '}
            <span className="pl-1">0 Tokens Available</span>
          </Link>
        </div>
        {/* <div className="flex-1 overflow-auto bg-gradient-to-b from-green-300 to-green-400"> */}
        <div className="flex-1 overflow-auto">list of posts</div>
        <div className="flex items-center gap-2 border-t border-t-white/50 h-20 px-2">
          {user ? (
            <>
              <div className="min-w-[50px]">
                <Image
                  src={user.picture}
                  alt={user.name}
                  height={50}
                  width={50}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="font-bold">{user.email}</div>
                <Link className="text-sm" href="/api/auth/logout">
                  Logout
                </Link>
              </div>
            </>
          ) : (
            <Link href="/api/auth/login">Login</Link>
          )}
        </div>
      </div>
      <div className="bg-pink-500">{children}</div>
    </div>
  );
};
