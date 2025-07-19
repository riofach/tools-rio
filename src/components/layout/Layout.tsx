import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

type LayoutProps = {
	children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
			<Header />
			<main className="container mx-auto px-4 py-8 min-h-[calc(100vh-200px)]">
				{children}
			</main>
			<Footer />
		</div>
	);
};

export default Layout;