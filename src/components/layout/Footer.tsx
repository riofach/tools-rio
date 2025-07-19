import { Heart, Code } from 'lucide-react';

const Footer = () => {
	return (
		<footer className="bg-white/80 backdrop-blur-md border-t border-slate-200 mt-auto">
			<div className="container mx-auto px-4 py-6">
				<div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
					<div className="flex items-center space-x-2 text-slate-600">
						<span>© {new Date().getFullYear()}</span>
						<span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							RioTools
						</span>
						<span>by Rioraditya</span>
					</div>

					<div className="flex items-center space-x-2 text-slate-500">
						<span>Made with</span>
						<Heart className="h-4 w-4 text-red-500 fill-current" />
						<span>and</span>
						<Code className="h-4 w-4 text-blue-500" />
						<span>in Indonesia</span>
					</div>
				</div>

				<div className="mt-4 pt-4 border-t border-slate-200 text-center text-sm text-slate-500">
					<p>
						Free, secure, and privacy-focused file processing tools. All operations are performed
						locally.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
