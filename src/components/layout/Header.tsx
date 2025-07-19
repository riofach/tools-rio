import Link from 'next/link';

const Header = () => {
	return (
		<header className="bg-white shadow-md">
			<div className="container mx-auto px-4 py-4 flex justify-between items-center">
				<Link href="/" className="text-2xl font-bold text-gray-800">
					Rioraditya Tools
				</Link>
				<nav>{/* Navigation links can be added here later */}</nav>
			</div>
		</header>
	);
};

export default Header;
