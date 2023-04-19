import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ObjectId } from 'mongodb';
import { AppLayout } from '../../components/AppLayout';
import clientPromise from '../../lib/mongodb';
import { getAppProps } from '../../utils/getAppProps';
export default function Post(props) {
  console.log(props.postContent, 'props');
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
        postContent: post.postContent,
        title: post.title,
        metaDescription: post.metaDescription,
        keywords: post.keywords,
        ...props
      }
    };
  }
});
