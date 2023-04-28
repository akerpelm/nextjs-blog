import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { faBrain } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { AppLayout } from '../components/AppLayout';
import { getAppProps } from '../utils/getAppProps';
export default function Success() {
  return (
    <div className="flex flex-col items-center justify-center text-pink-500">
      <FontAwesomeIcon icon={faBrain} className="text-8xl" />
      <h1>Thank you for your purchase!</h1>
      <Link href="/posts/new" className="btn-alt">
        Home
      </Link>
    </div>
  );
}

Success.getLayout = function getLayout(page, pageProps) {
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
