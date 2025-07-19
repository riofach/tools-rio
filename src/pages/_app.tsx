import type { AppProps } from 'next/app';
import Layout from '../components/layout/Layout';
import '../styles/globals.css';
import dynamic from 'next/dynamic';

const StagewiseToolbar = dynamic(
	() => import('@stagewise/toolbar-next').then((mod) => mod.StagewiseToolbar),
	{ ssr: false }
);

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Layout>
			<Component {...pageProps} />
			{process.env.NODE_ENV === 'development' && <StagewiseToolbar config={{ plugins: [] }} />}
		</Layout>
	);
}

export default MyApp;
