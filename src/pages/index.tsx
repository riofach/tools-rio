import type { NextPage } from 'next';
import Card from '../components/ui/Card';

const tools = [
	{
		href: '/compress-image',
		title: 'Compress Image',
		description: 'Reduce the file size of your JPG, PNG, and WEBP images.',
	},
	{
		href: '/convert-image',
		title: 'Convert Image',
		description: 'Change the format of your images to JPG, PNG, or WEBP.',
	},
	{
		href: '/compress-pdf',
		title: 'Compress PDF',
		description: 'Reduce the file size of your PDF documents.',
	},
];

const HomePage: NextPage = () => {
	return (
		<div className="text-center">
			<h1 className="text-4xl font-bold mb-4">Online File Tools</h1>
			<p className="text-lg text-gray-600 mb-12">
				Simple, free, and privacy-focused tools to process your files online.
			</p>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{tools.map((tool) => (
					<Card
						key={tool.href}
						href={tool.href}
						title={tool.title}
						description={tool.description}
					/>
				))}
			</div>
		</div>
	);
};

export default HomePage;
