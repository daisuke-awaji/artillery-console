import { NextPage } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import { Toolbar } from './Toolbar';

const Layout: NextPage = ({ children }) => {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full h-screen">
        <Toolbar />
        <div className="overflow-hidden">
          <div>{children}</div>
          {/* <Sidebar /> */}
          {/* <Content /> */}
        </div>
      </main>
    </>
  );
};

export default Layout;