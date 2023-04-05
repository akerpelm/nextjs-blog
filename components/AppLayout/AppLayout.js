import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import Link from 'next/link';

export const AppLayout = ({ children }) => {
  const { user } = useUser();

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className=" flex flex-col text-white overflow-hidden bg-slate-800">
        <div className>
          <div>logo</div>
          <Link
            href="/posts/new"
            className="bg-pink-500 tracking-wider w-full text-center text-white font-bold cursor-pointer uppercase px-4 py-2 rounded-sm hover:bg-pink-700 transition-colors block"
          >
            New Post
          </Link>
          <Link href="/token-refill">0 Tokens Available</Link>
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
