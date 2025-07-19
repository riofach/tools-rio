import type { NextPage } from 'next';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FileUploader from '../components/FileUploader';
import {
	Download,
	Loader2,
	ArrowLeft,
	FileImage,
	RefreshCw,
	Zap,
	Eye,
	Info,
	ArrowRight,
} from 'lucide-react';

const formatOptions: {
	value: 'jpeg' | 'png' | 'webp';
	label: string;
	description: string;
	color: string;
}[] = [
	{
		value: 'jpeg',
		label: 'JPEG',
		description: 'Best for photos, smaller file size',
		color: 'from-orange-500 to-red-500',
	},
	{
		value: 'png',
		label: 'PNG',
		description: 'Supports transparency, lossless',
		color: 'from-blue-500 to-cyan-500',
	},
	{
		value: 'webp',
		label: 'WEBP',
		description: 'Modern format, excellent compression',
		color: 'from-green-500 to-emerald-500',
	},
];

const ConvertImagePage: NextPage = () => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [outputFormat, setOutputFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
	const [originalPreview, setOriginalPreview] = useState<string | null>(null);
	const [convertedPreview, setConvertedPreview] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFileSelect = (file: File) => {
		setSelectedFile(file);
		setOriginalPreview(URL.createObjectURL(file));
		setConvertedPreview(null);
		setError(null);
	};

	const handleConvert = async () => {
		if (!selectedFile) return;

		setIsLoading(true);
		setError(null);
		setConvertedPreview(null);

		const formData = new FormData();
		formData.append('file', selectedFile);
		formData.append('format', outputFormat);

		try {
			const response = await fetch('/api/convert-image', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				const errData = await response.json();
				throw new Error(errData.error || 'Failed to convert image.');
			}

			const blob = await response.blob();
			setConvertedPreview(URL.createObjectURL(blob));
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An unknown error occurred.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDownload = () => {
		if (!convertedPreview || !selectedFile) return;
		const a = document.createElement('a');
		a.href = convertedPreview;
		const name = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.'));
		a.download = `converted-${name}.${outputFormat}`;
		document.body.appendChild(a);
		a.click();
		a.remove();
	};

	const formatFileSize = (bytes: number) => {
		return (bytes / 1024).toFixed(2);
	};

	const getOriginalFormat = () => {
		if (!selectedFile) return '';
		return selectedFile.type.split('/')[1]?.toUpperCase() || 'Unknown';
	};

	return (
		<div className="container mx-auto max-w-6xl space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<Link
						href="/"
						className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
					>
						<ArrowLeft className="h-5 w-5 mr-2" />
						Back to Tools
					</Link>
				</div>
			</div>

			{/* Page Title */}
			<div className="text-center space-y-4">
				<div className="flex items-center justify-center space-x-3">
					<div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
						<RefreshCw className="h-8 w-8 text-white" />
					</div>
					<div>
						<h1 className="text-4xl font-bold text-slate-900">Image Converter</h1>
						<p className="text-slate-600">Transform images between different formats instantly</p>
					</div>
				</div>

				<div className="flex items-center justify-center space-x-6">
					<Badge variant="secondary" className="flex items-center space-x-2">
						<Zap className="h-4 w-4" />
						<span>Instant Conversion</span>
					</Badge>
					<Badge variant="secondary" className="flex items-center space-x-2">
						<Eye className="h-4 w-4" />
						<span>Preview Results</span>
					</Badge>
					<Badge variant="secondary" className="flex items-center space-x-2">
						<FileImage className="h-4 w-4" />
						<span>Multiple Formats</span>
					</Badge>
				</div>
			</div>

			{!selectedFile ? (
				<FileUploader
					onFileSelect={handleFileSelect}
					acceptedTypes={['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp']}
					placeholder="Upload an image to convert (JPG, PNG, WEBP, GIF, BMP)"
				/>
			) : (
				<div className="space-y-8">
					{/* Format Selection */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<RefreshCw className="h-5 w-5" />
								<span>Conversion Settings</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Format Display */}
							<div className="flex items-center justify-center space-x-8">
								<div className="text-center">
									<div className="p-4 bg-slate-100 rounded-xl">
										<FileImage className="h-8 w-8 text-slate-600 mx-auto" />
									</div>
									<p className="mt-2 font-medium text-slate-900">{getOriginalFormat()}</p>
									<p className="text-sm text-slate-500">Original format</p>
								</div>

								<ArrowRight className="h-6 w-6 text-slate-400" />

								<div className="text-center">
									<div
										className={`p-4 bg-gradient-to-br ${
											formatOptions.find((f) => f.value === outputFormat)?.color
										} rounded-xl`}
									>
										<FileImage className="h-8 w-8 text-white mx-auto" />
									</div>
									<p className="mt-2 font-medium text-slate-900">{outputFormat.toUpperCase()}</p>
									<p className="text-sm text-slate-500">Target format</p>
								</div>
							</div>

							{/* Format Options */}
							<div className="space-y-4">
								<label className="text-sm font-medium text-slate-700">Choose output format:</label>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									{formatOptions.map((format) => (
										<div
											key={format.value}
											onClick={() => setOutputFormat(format.value)}
											className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
												outputFormat === format.value
													? 'border-blue-500 bg-blue-50'
													: 'border-slate-200 hover:border-slate-300'
											}`}
										>
											<div className="space-y-3">
												<div
													className={`w-12 h-12 bg-gradient-to-br ${format.color} rounded-lg flex items-center justify-center mx-auto`}
												>
													<FileImage className="h-6 w-6 text-white" />
												</div>
												<div className="text-center">
													<h3 className="font-semibold text-slate-900">{format.label}</h3>
													<p className="text-xs text-slate-600 mt-1">{format.description}</p>
												</div>
												{outputFormat === format.value && (
													<Badge className="w-full justify-center">Selected</Badge>
												)}
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex justify-center space-x-4">
								<Button
									onClick={handleConvert}
									disabled={isLoading}
									size="lg"
									className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 cursor-pointer disabled:cursor-not-allowed"
								>
									{isLoading ? (
										<>
											<Loader2 className="h-5 w-5 mr-2 animate-spin" />
											Converting...
										</>
									) : (
										<>
											<RefreshCw className="h-5 w-5 mr-2" />
											Convert Image
										</>
									)}
								</Button>
								{convertedPreview && (
									<Button
										onClick={handleDownload}
										variant="outline"
										size="lg"
										className="cursor-pointer"
									>
										<Download className="h-5 w-5 mr-2" />
										Download
									</Button>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Image Preview */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Eye className="h-5 w-5" />
								<span>Preview</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								{/* Original Image */}
								<div className="space-y-4">
									<div className="text-center">
										<Badge variant="outline" className="mb-4">
											Original
										</Badge>
										{originalPreview && (
											<div className="border-2 border-dashed border-slate-200 rounded-lg p-4 bg-slate-50">
												<img
													src={originalPreview}
													alt="Original Preview"
													className="w-full h-auto max-h-80 object-contain mx-auto rounded"
												/>
											</div>
										)}
										<div className="mt-3 text-sm text-slate-600">
											<p>
												{getOriginalFormat()} • {formatFileSize(selectedFile.size)} KB
											</p>
										</div>
									</div>
								</div>

								{/* Converted Image */}
								<div className="space-y-4">
									<div className="text-center">
										<Badge variant="outline" className="mb-4">
											Converted
										</Badge>
										{convertedPreview ? (
											<div className="border-2 border-dashed border-green-200 rounded-lg p-4 bg-green-50">
												<img
													src={convertedPreview}
													alt="Converted Preview"
													className="w-full h-auto max-h-80 object-contain mx-auto rounded"
												/>
											</div>
										) : (
											<div className="border-2 border-dashed border-slate-200 rounded-lg p-4 bg-slate-50 h-80 flex items-center justify-center">
												<div className="text-center space-y-2">
													<RefreshCw className="h-12 w-12 text-slate-300 mx-auto" />
													<p className="text-slate-500">
														{isLoading ? 'Converting...' : 'Click "Convert Image" to see result'}
													</p>
												</div>
											</div>
										)}
										<div className="mt-3 text-sm text-slate-600">
											<p>{outputFormat.toUpperCase()} • Ready for download</p>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Reset Button */}
					<div className="text-center">
						<Button
							variant="outline"
							className="cursor-pointer"
							onClick={() => {
								setSelectedFile(null);
								setOriginalPreview(null);
								setConvertedPreview(null);
								setError(null);
							}}
						>
							Upload Different Image
						</Button>
					</div>
				</div>
			)}

			{error && (
				<Card className="border-red-200 bg-red-50">
					<CardContent className="pt-6">
						<div className="flex items-center space-x-2 text-red-700">
							<div className="h-2 w-2 bg-red-500 rounded-full" />
							<p className="font-medium">Error: {error}</p>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Format Information */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{formatOptions.map((format, index) => (
					<Card key={format.value} className="bg-gradient-to-br from-slate-50 to-gray-50">
						<CardHeader>
							<CardTitle className="text-lg flex items-center space-x-2">
								<div
									className={`w-8 h-8 bg-gradient-to-br ${format.color} rounded-lg flex items-center justify-center`}
								>
									<FileImage className="h-4 w-4 text-white" />
								</div>
								<span>{format.label}</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 text-sm text-slate-600">
							<p>{format.description}</p>
							{format.value === 'jpeg' && (
								<>
									<p>• Best for: Photographs and complex images</p>
									<p>• Pros: Small file sizes, widely supported</p>
									<p>• Cons: Lossy compression, no transparency</p>
								</>
							)}
							{format.value === 'png' && (
								<>
									<p>• Best for: Graphics with transparency</p>
									<p>• Pros: Lossless, supports transparency</p>
									<p>• Cons: Larger file sizes</p>
								</>
							)}
							{format.value === 'webp' && (
								<>
									<p>• Best for: Modern web applications</p>
									<p>• Pros: Excellent compression, supports transparency</p>
									<p>• Cons: Limited older browser support</p>
								</>
							)}
						</CardContent>
					</Card>
				))}
			</div>

			{/* Usage Tips */}
			<Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
				<CardHeader>
					<CardTitle className="text-blue-900 flex items-center space-x-2">
						<Info className="h-5 w-5" />
						<span>Conversion Tips</span>
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 text-blue-800">
					<p>
						• <strong>JPEG:</strong> Perfect for photos and images with many colors
					</p>
					<p>
						• <strong>PNG:</strong> Use when you need transparency or crisp edges
					</p>
					<p>
						• <strong>WEBP:</strong> Modern format with better compression than JPEG/PNG
					</p>
					<p>• Converting to JPEG will remove transparency from PNG images</p>
					<p>• Quality is preserved during conversion when possible</p>
				</CardContent>
			</Card>
		</div>
	);
};

export default ConvertImagePage;
