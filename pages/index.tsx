import type { NextPage } from 'next';
import Link from 'next/link';
import Layout from '../components/Layout';

const Home: NextPage = () => {
  return (
    <Layout>
      <h1>Artillery Viewer</h1>
      <Link href={'/artillery/viewer'}>Artillery</Link>
    </Layout>
  );
};

export default Home;
