import Link from 'next/link';
import { FileImage, FileText, Settings } from 'lucide-react';

const Header = () => {
	return (
		<header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
			<div className="container mx-auto px-4 py-4">
				<div className="flex justify-between items-center">
					<Link href="/" className="flex items-center space-x-3 group">
						<div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl group-hover:scale-105 transition-transform">
							<Settings className="h-6 w-6 text-white" />
						</div>
						<div>
							<h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
								RioTools
							</h1>
							<p className="text-sm text-slate-500">Professional File Tools</p>
						</div>
					</Link>

					<nav className="hidden md:flex items-center space-x-6">
						<Link
							href="/compress-image"
							className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors"
						>
							<FileImage className="h-4 w-4" />
							<span>Image Tools</span>
						</Link>
						<Link
							href="/compress-pdf"
							className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors"
						>
							<FileText className="h-4 w-4" />
							<span>PDF Tools</span>
						</Link>
					</nav>
				</div>
			</div>
		</header>
	);
};

export default Header;
