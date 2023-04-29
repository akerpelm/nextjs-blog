import { useUser } from '@auth0/nextjs-auth0/client';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect } from 'react';
import PostsContext from '../../context/postsContext';
import { Logo } from '../Logo';

export const AppLayout = ({
  children,
  availableTokens,
  posts: postsFromSSR,
  postId
}) => {
  const { user } = useUser();

  const { posts, setPostsFromSSR, getPosts, lastPost } =
    useContext(PostsContext);

  useEffect(() => {
    setPostsFromSSR(postsFromSSR);
  }, [postsFromSSR, setPostsFromSSR]);

  const titleCase = (str) => {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
  };

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className=" flex flex-col text-white overflow-hidden bg-slate-800">
        <div className="mb-2">
          <Logo />
          <Link href="/posts/new" className="btn">
            New Post
          </Link>
          <Link href="/token-refill" className="block mt-2 text-center">
            <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
            <span className="pl-1 ">{availableTokens} Tokens Available</span>
          </Link>
        </div>
        <div className="px-4 flex-1 overflow-auto">
          {posts.map((post) => {
            return (
              <Link
                key={post._id}
                href={`/posts/${post._id}`}
                className={` py-1 border border-white/0 block text-ellipsis overflow-hidden whitespace-nowrap my-2 px-4 bg-white/10 cursor-pointer rounded-sm w-auto hover:font-bold hover:text-pink-500  border-white ${
                  postId === post._id ? 'bg-white/20 px-5 border-white' : ''
                }`}
              >
                {titleCase(post.topic)}
              </Link>
            );
          })}
          {!lastPost && (
            <div
              onClick={() =>
                getPosts({ lastPostDate: posts[posts.length - 1].createdDate })
              }
              className="hover:underline text-sm text-slate-400 text-center cursor-pointer mt-4"
            >
              Load more posts
            </div>
          )}
        </div>
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
      {children}
    </div>
  );
};
