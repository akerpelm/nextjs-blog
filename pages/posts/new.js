import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useState } from 'react';
import { AppLayout } from '../../components/AppLayout';

export default function NewPost(props) {
  const [postContent, setPostContent] = useState('');
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [aiModel, setAiModel] = useState('gpt-3.5-turbo'); // needs implementation in generatePost

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/generatePost`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ topic, keywords })
    });
    const json = await response.json();
    setPostContent(json.data.postContent);
    console.log(json.data.postContent, 'json');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <strong>Generate a blog post on the topic of:</strong>
          </label>
          <textarea
            className="resize-none border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div>
          <label>
            <strong>Targetting the following keywords:</strong>
          </label>
          <textarea
            className="resize-none border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>
        <div>
          <select
            value={aiModel}
            onChange={(e) => setAiModel(e.target.value)}
            className="border-slate-500 w-med my-2 px-4 py-2 items-center content-center justify-center align-center rounded-sm"
          >
            <option value="gpt-3.5-turbo">ChatGPT-3.5-Turbo</option>
            <option value="text-davinci-003">Text-DaVinci-003</option>
          </select>
        </div>
        <button type="sumbit" className="btn-alt">
          Generate
        </button>
      </form>
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
