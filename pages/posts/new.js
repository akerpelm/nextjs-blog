import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useState } from 'react';
import { AppLayout } from '../../components/AppLayout';

export default function NewPost(props) {
  const [postContent, setPostContent] = useState('');

  const handleClick = async () => {
    const response = await fetch(`/api/generatePost`, {
      method: 'POST'
    });
    const json = await response.json();
    setPostContent(json.data.postContent);
    console.log(json.data.postContent, 'json');
  };
  return (
    <div>
      <h1>This is the new post page</h1>
      <button className="btn-alt" onClick={handleClick}>
        Generate
      </button>
      <div
        className="max-w-screen-sm p-10"
        dangerouslySetInnerHTML={{ __html: postContent }}
      />
    </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {}
  };
});
