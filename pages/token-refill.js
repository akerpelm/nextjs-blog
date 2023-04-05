import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../components/AppLayout';

export default function TokenRefill() {
  return (
    <div>
      <h1>This is the token refill page</h1>
    </div>
  );
}

TokenRefill.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};
export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {}
  };
});
