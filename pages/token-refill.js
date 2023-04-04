import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default function TokenRefill() {
  return (
    <div>
      <h1>This is the token refill page</h1>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {}
  };
});
