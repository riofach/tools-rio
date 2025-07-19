import type { NextPage } from 'next';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import FileUploader from '../components/FileUploader';
import {
	Download,
	Loader2,
	ArrowLeft,
	FileText,
	TrendingDown,
	Shield,
	Zap,
	Info,
	CheckCircle,
	Settings,
} from 'lucide-react';

type CompressionLevel = 'low' | 'medium' | 'high';

const compressionLevels = {
	low: {
		label: 'Maximum Compression',
		description: 'Smallest file size (72 DPI)',
		icon: '🗜️',
		color: 'text-red-600',
		bgColor: 'bg-red-50',
	},
	medium: {
		label: 'Balanced',
		description: 'Good quality and size (150 DPI)',
		icon: '⚖️',
		color: 'text-blue-600',
		bgColor: 'bg-blue-50',
	},
	high: {
		label: 'High Quality',
		description: 'Best quality, larger size (300 DPI)',
		icon: '✨',
		color: 'text-green-600',
		bgColor: 'bg-green-50',
	},
};

const CompressPdfPage: NextPage = () => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [level, setLevel] = useState<CompressionLevel>('medium');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const handleFileSelect = (file: File) => {
		if (file.type !== 'application/pdf') {
			setError('Invalid file type. Please upload a PDF.');
			setSelectedFile(null);
			return;
		}
		setSelectedFile(file);
		setError(null);
		setSuccess(false);
	};

	const handleCompress = async () => {
		if (!selectedFile) return;

		setIsLoading(true);
		setError(null);
		setSuccess(false);

		const formData = new FormData();
		formData.append('file', selectedFile);
		formData.append('level', level);

		try {
			const response = await fetch('/api/compress-pdf', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				const errData = await response.json();
				throw new Error(errData.error || 'Failed to compress PDF.');
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `compressed-${selectedFile.name}`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(url);
			setSuccess(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An unknown error occurred.');
		} finally {
			setIsLoading(false);
		}
	};

	const formatFileSize = (bytes: number) => {
		return (bytes / 1024 / 1024).toFixed(2);
	};

	return (
		<div className="container mx-auto max-w-4xl space-y-8">
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
					<div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
						<FileText className="h-8 w-8 text-white" />
					</div>
					<div>
						<h1 className="text-4xl font-bold text-slate-900">PDF Compressor</h1>
						<p className="text-slate-600">Optimize PDF files for web, email, or storage</p>
					</div>
				</div>

				<div className="flex items-center justify-center space-x-6">
					<Badge variant="secondary" className="flex items-center space-x-2">
						<Shield className="h-4 w-4" />
						<span>Secure Processing</span>
					</Badge>
					<Badge variant="secondary" className="flex items-center space-x-2">
						<Zap className="h-4 w-4" />
						<span>Fast Compression</span>
					</Badge>
					<Badge variant="secondary" className="flex items-center space-x-2">
						<TrendingDown className="h-4 w-4" />
						<span>Up to 90% Reduction</span>
					</Badge>
				</div>
			</div>

			{!selectedFile ? (
				<FileUploader
					onFileSelect={handleFileSelect}
					acceptedTypes={['application/pdf']}
					placeholder="Upload a PDF to compress"
					maxSize={50 * 1024 * 1024} // 50MB for PDFs
				/>
			) : (
				<div className="space-y-8">
					{/* File Info */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Info className="h-5 w-5" />
								<span>File Information</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
								<div className="flex items-center space-x-4">
									<div className="p-3 bg-red-100 rounded-lg">
										<FileText className="h-6 w-6 text-red-600" />
									</div>
									<div>
										<p className="font-medium text-slate-900">{selectedFile.name}</p>
										<p className="text-sm text-slate-500">{formatFileSize(selectedFile.size)} MB</p>
									</div>
								</div>
								{success && (
									<div className="flex items-center space-x-2 text-green-600">
										<CheckCircle className="h-5 w-5" />
										<span className="font-medium">Compressed Successfully!</span>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Compression Settings */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Settings className="h-5 w-5" />
								<span>Compression Settings</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-4">
								<label className="text-sm font-medium text-slate-700">
									Choose compression level:
								</label>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									{(
										Object.entries(compressionLevels) as [
											CompressionLevel,
											typeof compressionLevels.low
										][]
									).map(([key, config]) => (
										<div
											key={key}
											onClick={() => setLevel(key)}
											className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
												level === key
													? 'border-blue-500 bg-blue-50'
													: 'border-slate-200 hover:border-slate-300'
											}`}
										>
											<div className="text-center space-y-2">
												<div className="text-2xl">{config.icon}</div>
												<h3 className="font-semibold text-slate-900">{config.label}</h3>
												<p className="text-xs text-slate-600">{config.description}</p>
												{level === key && <Badge className="mt-2">Selected</Badge>}
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Action Button */}
							<div className="text-center">
								<Button
									onClick={handleCompress}
									disabled={isLoading}
									size="lg"
									className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 cursor-pointer disabled:cursor-not-allowed"
								>
									{isLoading ? (
										<>
											<Loader2 className="h-5 w-5 mr-2 animate-spin" />
											Compressing PDF...
										</>
									) : (
										<>
											<Zap className="h-5 w-5 mr-2" />
											Compress PDF
										</>
									)}
								</Button>
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
								setError(null);
								setSuccess(false);
							}}
						>
							Upload Different PDF
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

			{/* Information Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
					<CardHeader>
						<CardTitle className="text-blue-900 flex items-center space-x-2">
							<Shield className="h-5 w-5" />
							<span>Privacy & Security</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2 text-blue-800">
						<p>• Files are processed locally on our secure servers</p>
						<p>• No data is stored or shared with third parties</p>
						<p>• Files are automatically deleted after processing</p>
						<p>• SSL encryption protects your data in transit</p>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
					<CardHeader>
						<CardTitle className="text-green-900 flex items-center space-x-2">
							<Info className="h-5 w-5" />
							<span>Compression Guide</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2 text-green-800">
						<p>
							• <strong>Maximum:</strong> Best for archiving or storage
						</p>
						<p>
							• <strong>Balanced:</strong> Perfect for email attachments
						</p>
						<p>
							• <strong>High Quality:</strong> Ideal for printing
						</p>
						<p>• Compression results vary by PDF content</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default CompressPdfPage;
