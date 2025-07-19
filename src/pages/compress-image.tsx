import type { NextPage } from 'next';
import { useState } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import FileUploader from '../components/FileUploader';
import {
	Download,
	Loader2,
	ArrowLeft,
	FileImage,
	TrendingDown,
	Zap,
	Eye,
	Info,
} from 'lucide-react';

const CompressImagePage: NextPage = () => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [quality, setQuality] = useState([80]);
	const [originalPreview, setOriginalPreview] = useState<string | null>(null);
	const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
	const [compressedSize, setCompressedSize] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFileSelect = (file: File) => {
		setSelectedFile(file);
		setOriginalPreview(URL.createObjectURL(file));
		setCompressedPreview(null);
		setCompressedSize(null);
		setError(null);
	};

	const handleCompress = async () => {
		if (!selectedFile) return;

		setIsLoading(true);
		setError(null);
		setCompressedPreview(null);

		const formData = new FormData();
		formData.append('file', selectedFile);
		formData.append('quality', quality[0].toString());

		try {
			const response = await fetch('/api/compress-image', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				const errData = await response.json();
				throw new Error(errData.error || 'Failed to compress image.');
			}

			const blob = await response.blob();
			setCompressedSize(blob.size);
			setCompressedPreview(URL.createObjectURL(blob));
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An unknown error occurred.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDownload = () => {
		if (!compressedPreview) return;
		const a = document.createElement('a');
		a.href = compressedPreview;
		a.download = `compressed-${selectedFile?.name}`;
		document.body.appendChild(a);
		a.click();
		a.remove();
	};

	const formatFileSize = (bytes: number) => {
		return (bytes / 1024).toFixed(2);
	};

	const getCompressionRatio = () => {
		if (!selectedFile || !compressedSize) return 0;
		return ((selectedFile.size - compressedSize) / selectedFile.size) * 100;
	};

	const getQualityLabel = (value: number) => {
		if (value >= 90) return 'High Quality';
		if (value >= 70) return 'Good Quality';
		if (value >= 50) return 'Medium Quality';
		return 'Low Quality';
	};

	const getQualityColor = (value: number) => {
		if (value >= 90) return 'text-green-600';
		if (value >= 70) return 'text-blue-600';
		if (value >= 50) return 'text-yellow-600';
		return 'text-red-600';
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
					<div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
						<FileImage className="h-8 w-8 text-white" />
					</div>
					<div>
						<h1 className="text-4xl font-bold text-slate-900">Image Compressor</h1>
						<p className="text-slate-600">Reduce file size while maintaining visual quality</p>
					</div>
				</div>

				<div className="flex items-center justify-center space-x-6">
					<Badge variant="secondary" className="flex items-center space-x-2">
						<Zap className="h-4 w-4" />
						<span>Fast Processing</span>
					</Badge>
					<Badge variant="secondary" className="flex items-center space-x-2">
						<Eye className="h-4 w-4" />
						<span>Live Preview</span>
					</Badge>
					<Badge variant="secondary" className="flex items-center space-x-2">
						<TrendingDown className="h-4 w-4" />
						<span>Up to 80% Reduction</span>
					</Badge>
				</div>
			</div>

			{!selectedFile ? (
				<FileUploader
					onFileSelect={handleFileSelect}
					acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
					placeholder="Upload an image to compress (JPG, PNG, WEBP)"
				/>
			) : (
				<div className="space-y-8">
					{/* Control Panel */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Info className="h-5 w-5" />
								<span>Compression Settings</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Quality Slider */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<label className="text-sm font-medium text-slate-700">Quality Level</label>
									<div className="flex items-center space-x-2">
										<Badge variant="outline" className={getQualityColor(quality[0])}>
											{quality[0]}%
										</Badge>
										<span className={`text-sm font-medium ${getQualityColor(quality[0])}`}>
											{getQualityLabel(quality[0])}
										</span>
									</div>
								</div>
								<div className="px-3 py-2">
									<input
										type="range"
										min={10}
										max={100}
										step={5}
										value={quality[0]}
										onChange={(e) => setQuality([parseInt(e.target.value)])}
										disabled={isLoading}
										className="quality-slider w-full"
									/>
								</div>
								<div className="flex justify-between text-xs text-slate-500 px-2">
									<div className="flex items-center space-x-1">
										<div className="w-2 h-2 rounded-full bg-red-500"></div>
										<span>Lower size</span>
									</div>
									<div className="flex items-center space-x-1">
										<span>Higher quality</span>
										<div className="w-2 h-2 rounded-full bg-green-500"></div>
									</div>
								</div>
							</div>

							{/* File Info */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="text-center p-4 bg-slate-50 rounded-lg">
									<p className="text-sm text-slate-600">Original Size</p>
									<p className="text-lg font-semibold text-slate-900">
										{formatFileSize(selectedFile.size)} KB
									</p>
								</div>
								{compressedSize && (
									<>
										<div className="text-center p-4 bg-green-50 rounded-lg">
											<p className="text-sm text-slate-600">Compressed Size</p>
											<p className="text-lg font-semibold text-green-700">
												{formatFileSize(compressedSize)} KB
											</p>
										</div>
										<div className="text-center p-4 bg-blue-50 rounded-lg">
											<p className="text-sm text-slate-600">Size Reduction</p>
											<p className="text-lg font-semibold text-blue-700">
												{getCompressionRatio().toFixed(0)}%
											</p>
										</div>
									</>
								)}
							</div>

							{/* Action Buttons */}
							<div className="flex justify-center space-x-4">
								<Button
									onClick={handleCompress}
									disabled={isLoading}
									className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 cursor-pointer disabled:cursor-not-allowed"
								>
									{isLoading ? (
										<>
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											Compressing...
										</>
									) : (
										<>
											<Zap className="h-4 w-4 mr-2" />
											Compress Image
										</>
									)}
								</Button>
								{compressedPreview && (
									<Button onClick={handleDownload} variant="outline" className="cursor-pointer">
										<Download className="h-4 w-4 mr-2" />
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
								<span>Preview & Comparison</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							{originalPreview && compressedPreview ? (
								<div className="space-y-4">
									<div className="bg-slate-100 p-2 rounded-lg">
										<ReactCompareSlider
											itemOne={
												<ReactCompareSliderImage
													src={originalPreview}
													alt="Original Image"
													className="w-full h-auto max-h-96 object-contain"
												/>
											}
											itemTwo={
												<ReactCompareSliderImage
													src={compressedPreview}
													alt="Compressed Image"
													className="w-full h-auto max-h-96 object-contain"
												/>
											}
											className="w-full rounded-lg overflow-hidden"
										/>
									</div>
									<div className="grid grid-cols-2 gap-4 text-center text-sm text-slate-600">
										<div>
											<p className="font-medium">Original</p>
											<p>{formatFileSize(selectedFile.size)} KB</p>
										</div>
										<div>
											<p className="font-medium">Compressed</p>
											<p>{formatFileSize(compressedSize!)} KB</p>
										</div>
									</div>
								</div>
							) : originalPreview ? (
								<div className="text-center">
									<img
										src={originalPreview}
										alt="Original Preview"
										className="w-full h-auto max-h-96 object-contain mx-auto rounded-lg"
									/>
									<p className="mt-4 text-sm text-slate-600">
										Adjust quality and click "Compress Image" to see the comparison
									</p>
								</div>
							) : null}
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
								setCompressedPreview(null);
								setCompressedSize(null);
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

			{/* Tips Section */}
			<Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
				<CardHeader>
					<CardTitle className="text-blue-900">💡 Compression Tips</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 text-blue-800">
					<p>• Higher quality (90-100%) preserves more detail but larger file size</p>
					<p>• Medium quality (70-80%) offers the best balance for web use</p>
					<p>• Lower quality (50-60%) creates smallest files but may show artifacts</p>
					<p>• JPEG format works best for photos, PNG for graphics with transparency</p>
				</CardContent>
			</Card>
		</div>
	);
};

export default CompressImagePage;
