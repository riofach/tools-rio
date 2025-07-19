import type { NextPage } from 'next';
import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import Button from '../components/ui/Button';

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

	const formatOptions: { value: 'jpeg' | 'png' | 'webp'; label: string }[] = [
		{ value: 'jpeg', label: 'JPEG' },
		{ value: 'png', label: 'PNG' },
		{ value: 'webp', label: 'WEBP' },
	];

	return (
		<div className="container mx-auto max-w-5xl">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold mb-2">Convert Image</h1>
				<p className="text-lg text-gray-600">
					Easily change the format of your images. Upload a file and select the target format.
				</p>
			</div>

			{!selectedFile ? (
				<FileUploader onFileSelect={handleFileSelect} />
			) : (
				<div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* Original Image */}
						<div className="text-center">
							<h3 className="text-xl font-semibold mb-4">Original</h3>
							{originalPreview && (
								<img
									src={originalPreview}
									alt="Original Preview"
									className="w-full h-auto rounded-lg mx-auto border"
								/>
							)}
						</div>
						{/* Converted Image */}
						<div className="text-center">
							<h3 className="text-xl font-semibold mb-4">Converted</h3>
							{convertedPreview ? (
								<img
									src={convertedPreview}
									alt="Converted Preview"
									className="w-full h-auto rounded-lg mx-auto border"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg border">
									<p className="text-gray-500">Waiting for conversion...</p>
								</div>
							)}
						</div>
					</div>

					<div className="mt-8 flex flex-col items-center">
						<div className="mb-4">
							<label htmlFor="format" className="form-label font-medium mr-4">
								Convert to:
							</label>
							<div className="inline-flex rounded-md shadow-sm">
								{formatOptions.map((format) => (
									<button
										key={format.value}
										onClick={() => setOutputFormat(format.value)}
										disabled={isLoading}
										className={`px-4 py-2 text-sm font-medium border-t border-b focus:z-10 focus:ring-2 focus:ring-blue-700
                    ${
											outputFormat === format.value
												? 'bg-blue-600 text-white'
												: 'bg-white text-gray-900 hover:bg-gray-100'
										}
                    ${format.value === formatOptions[0].value ? 'rounded-l-lg border-l' : ''}
                    ${
											format.value === formatOptions[formatOptions.length - 1].value
												? 'rounded-r-lg border-r border-l'
												: 'border-l'
										}
                  `}
									>
										{format.label}
									</button>
								))}
							</div>
						</div>

						<div className="flex gap-4">
							<Button onClick={handleConvert} disabled={isLoading}>
								{isLoading ? 'Converting...' : 'Convert'}
							</Button>
							{convertedPreview && <Button onClick={handleDownload}>Download</Button>}
						</div>
					</div>
				</div>
			)}

			{error && (
				<div className="mt-4 text-center text-red-600">
					<p>Error: {error}</p>
				</div>
			)}
		</div>
	);
};

export default ConvertImagePage;
