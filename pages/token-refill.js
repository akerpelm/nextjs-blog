import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { faBrain } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppLayout } from '../components/AppLayout';
import { getAppProps } from '../utils/getAppProps';
export default function TokenRefill() {
  const handleClick = async () => {
    const res = await fetch(`/api/addTokens`, {
      method: 'POST'
    });
    const json = await res.json();
    console.log(json, 'json');
    window.location.href = json.session.url;
  };
  return (
    <div className="flex flex-col items-center justify-center text-pink-500">
      <FontAwesomeIcon icon={faBrain} className="text-3xl" />
      <h1>Add Tokens</h1>
      <p className="text-lg">
        For a limited time, 10 tokens for{' '}
        <s className="text-slate-500">$12.99</s>{' '}
        <span className="font-bold underline text-lg">$7.99</span>
      </p>
      <p className="text-lg">
        Using Stripe, you can rest assured that no sensitive information is
        stored or processed on our site.
      </p>
      <button className="btn-alt" onClick={handleClick}>
        Add Tokens
      </button>
    </div>
  );
}

TokenRefill.getLayout = function getLayout(page, pageProps) {
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
