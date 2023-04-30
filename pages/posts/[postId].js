import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ObjectId } from 'mongodb';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { AppLayout } from '../../components/AppLayout';
import PostsContext from '../../context/postsContext';
import clientPromise from '../../lib/mongodb';
import { getAppProps } from '../../utils/getAppProps';

export default function Post(props) {
  const router = useRouter();
  const [confirmDeleteMessage, setConfirmDeleteMessage] = useState(false);
  const { deletePost } = useContext(PostsContext);

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/deletePost`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ postId: props.id })
      });
      const json = await response.json();
      if (json.success) {
        deletePost(props.id);
        router.replace(`/posts/new`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="overflow-auto h-full bg-pink-100">
      <div className="max-w-screen-sm mx-auto">
        <div className="text-sm font-bold mt-6 p-2 bg-slate-400 rounded-sm">
          SEO Title and Meta Description
        </div>
        <div className="p-4 my-2 border border-slate-400 rounded-md bg-pink-500/20">
          <div className="text-slate-800 text-2xl font-bold">{props.title}</div>
          <div className="mt-2">{props.metaDescription}</div>
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-slate-400 rounded-sm">
          Keywords
        </div>
        <div className="flex flex-wrap pt-2 gap-1">
          {props.keywords.split(',').map((keyword, i) => {
            return (
              <div
                key={`${i}-${keyword}`}
                className="p-2 rounded-full bg-pink-500 text-white"
              >
                <FontAwesomeIcon icon={faHashtag} />
                {keyword}
              </div>
            );
          })}
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-slate-400 rounded-sm">
          Blog Post
        </div>
        <div
          className="text-slate-800"
          dangerouslySetInnerHTML={{ __html: props.postContent || '' }}
        />
        <div className="my-4">
          {!confirmDeleteMessage && (
            <button
              className="btn bg-red-600 hover:bg-red-700"
              onClick={() => setConfirmDeleteMessage(true)}
            >
              Delete Post
            </button>
          )}
          {!!confirmDeleteMessage && (
            <div>
              <p className="p-2 bg-red-300 text-center">
                Are you sure you want to delete this post? This action is
                irreversible.
              </p>
              <div className="grid grid-cols-2">
                <button
                  className="btn bg-slate-600 hover:bg-slate-700"
                  onClick={() => setConfirmDeleteMessage(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn bg-red-600 hover:bg-red-700"
                  onClick={handleDeleteConfirm}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    const userSession = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db('BlogStandard');
    const user = await db.collection('users').findOne({
      auth0Id: userSession.user.sub
    });
    const post = await db.collection('posts').findOne({
      _id: new ObjectId(ctx.params.postId),
      userId: user._id
    });

    if (!post) {
      return {
        redirect: {
          destination: '/posts/new',
          permanent: false
        }
      };
    }

    return {
      props: {
        id: ctx.params.postId,
        postContent: post.postContent,
        title: post.title,
        metaDescription: post.metaDescription,
        keywords: post.keywords,
        postCreatedDate: post.createdDate.toString(),
        ...props
      }
    };
  }
});
