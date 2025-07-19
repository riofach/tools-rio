import type { NextPage } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
	FileImage,
	FileText,
	Zap,
	Shield,
	Globe,
	Download,
	ArrowRight,
	Star,
	Users,
	Clock,
} from 'lucide-react';

const tools = [
	{
		href: '/compress-image',
		title: 'Image Compressor',
		description: 'Reduce file size while maintaining quality. Supports JPG, PNG, and WEBP formats.',
		icon: FileImage,
		color: 'from-green-500 to-emerald-500',
		features: ['Lossless compression', 'Batch processing', 'Live preview'],
		popular: true,
	},
	{
		href: '/convert-image',
		title: 'Image Converter',
		description: 'Convert between different image formats quickly and easily.',
		icon: FileImage,
		color: 'from-blue-500 to-cyan-500',
		features: ['Multiple formats', 'High quality', 'Fast conversion'],
	},
	{
		href: '/compress-pdf',
		title: 'PDF Compressor',
		description: 'Optimize PDF files for web, email, or storage with various compression levels.',
		icon: FileText,
		color: 'from-purple-500 to-pink-500',
		features: ['3 compression levels', 'Preserve quality', 'Secure processing'],
	},
];

const stats = [
	{ icon: Users, label: 'Users Served', value: '10K+' },
	{ icon: Download, label: 'Files Processed', value: '50K+' },
	{ icon: Clock, label: 'Average Time', value: '<30s' },
	{ icon: Star, label: 'User Rating', value: '4.9/5' },
];

const features = [
	{
		icon: Shield,
		title: 'Privacy First',
		description: 'All processing happens in your browser. We never store your files.',
	},
	{
		icon: Zap,
		title: 'Lightning Fast',
		description: 'Optimized algorithms ensure quick processing without quality loss.',
	},
	{
		icon: Globe,
		title: 'Works Everywhere',
		description: 'No software installation required. Works on any device with a browser.',
	},
];

const HomePage: NextPage = () => {
	return (
		<div className="space-y-16">
			{/* Hero Section */}
			<section className="text-center space-y-8">
				<div className="space-y-4">
					<Badge variant="secondary" className="px-4 py-2">
						<Zap className="h-4 w-4 mr-2" />
						Free & Privacy-Focused
					</Badge>
					<h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
						Professional File Tools
					</h1>
					<p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
						Compress, convert, and optimize your files with our suite of professional-grade tools.
						Fast, secure, and completely free.
					</p>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
					{stats.map((stat, index) => (
						<div key={index} className="text-center space-y-2">
							<div className="inline-flex p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
								<stat.icon className="h-6 w-6 text-blue-600" />
							</div>
							<div>
								<div className="text-2xl font-bold text-slate-900">{stat.value}</div>
								<div className="text-sm text-slate-500">{stat.label}</div>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Tools Grid */}
			<section className="space-y-8">
				<div className="text-center space-y-2">
					<h2 className="text-3xl font-bold text-slate-900">Choose Your Tool</h2>
					<p className="text-slate-600">Professional-grade file processing at your fingertips</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{tools.map((tool, index) => (
						<Link key={tool.href} href={tool.href} className="group">
							<Card className="h-full border-2 border-transparent hover:border-blue-200 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100/50 group-hover:scale-[1.02]">
								<CardHeader className="space-y-4">
									<div className="flex items-center justify-between">
										<div
											className={`p-3 bg-gradient-to-br ${tool.color} rounded-xl group-hover:scale-110 transition-transform`}
										>
											<tool.icon className="h-6 w-6 text-white" />
										</div>
										{tool.popular && (
											<Badge className="bg-gradient-to-r from-orange-500 to-red-500 border-0">
												Popular
											</Badge>
										)}
									</div>
									<div>
										<CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
											{tool.title}
										</CardTitle>
										<CardDescription className="text-slate-500 mt-2">
											{tool.description}
										</CardDescription>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										{tool.features.map((feature, idx) => (
											<div key={idx} className="flex items-center text-sm text-slate-600">
												<div className="h-1.5 w-1.5 bg-blue-500 rounded-full mr-3" />
												{feature}
											</div>
										))}
									</div>
									<div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
										<span>Get Started</span>
										<ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			</section>

			{/* Features Section */}
			<section className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 md:p-12">
				<div className="text-center space-y-8">
					<div className="space-y-2">
						<h2 className="text-3xl font-bold text-slate-900">Why Choose RioTools?</h2>
						<p className="text-slate-600">Built with privacy, speed, and quality in mind</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{features.map((feature, index) => (
							<div key={index} className="text-center space-y-4">
								<div className="inline-flex p-4 bg-white rounded-2xl shadow-lg">
									<feature.icon className="h-8 w-8 text-blue-600" />
								</div>
								<div className="space-y-2">
									<h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
									<p className="text-slate-600">{feature.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="text-center space-y-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
				<h2 className="text-3xl font-bold">Ready to optimize your files?</h2>
				<p className="text-blue-100 max-w-2xl mx-auto">
					Join thousands of users who trust RioTools for their file processing needs. Start
					compressing and converting your files today.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Link
						href="/compress-image"
						className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
					>
						<FileImage className="h-5 w-5 mr-2" />
						Compress Images
					</Link>
					<Link
						href="/compress-pdf"
						className="inline-flex items-center justify-center px-6 py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors border border-blue-500"
					>
						<FileText className="h-5 w-5 mr-2" />
						Compress PDFs
					</Link>
				</div>
			</section>
		</div>
	);
};

export default HomePage;
