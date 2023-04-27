import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { faBrain } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AppLayout } from '../../components/AppLayout';
import { getAppProps } from '../../utils/getAppProps';

export default function NewPost(props) {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [aiModel, setAiModel] = useState('gpt-3.5-turbo'); // needs implementation in generatePost
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/generatePost`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ topic, keywords })
      });
      const json = await response.json();
      if (json?.postId) {
        router.push(`/posts/${json.postId}`);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="bg-pink-100 h-full overflow-hidden">
      {!!loading && (
        <div className="text-pink-500 flex h-full animate-pulse w-full flex-col justify-center items-center">
          <FontAwesomeIcon icon={faBrain} className="text-8xl" />
          <h6 className="text-2xl">Generating...</h6>
        </div>
      )}
      {!loading && (
        <div className="w-full h-full flex flex-col overflow-auto">
          <form
            onSubmit={handleSubmit}
            className="m-auto w-full max-w-screen-sm bg-pink-400 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200"
          >
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
                <strong>Targeting the following keywords:</strong>
              </label>
              <textarea
                className="resize-none border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
              <small className="block mb-2">
                Separate keywords with a coma
              </small>
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
        </div>
      )}
    </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props
    };
  }
});
