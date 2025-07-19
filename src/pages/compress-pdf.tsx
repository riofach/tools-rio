import type { NextPage } from 'next';
import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import Button from '../components/ui/Button';

type CompressionLevel = 'low' | 'medium' | 'high';

const CompressPdfPage: NextPage = () => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [level, setLevel] = useState<CompressionLevel>('medium');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFileSelect = (file: File) => {
		// Basic type check on the client side
		if (file.type !== 'application/pdf') {
			setError('Invalid file type. Please upload a PDF.');
			setSelectedFile(null);
			return;
		}
		setSelectedFile(file);
		setError(null);
	};

	const handleCompress = async () => {
		if (!selectedFile) return;

		setIsLoading(true);
		setError(null);

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
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An unknown error occurred.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container mx-auto max-w-3xl">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold mb-2">Compress PDF</h1>
				<p className="text-lg text-gray-600">
					Reduce the file size of your PDF documents quickly and easily.
				</p>
			</div>

			<FileUploader onFileSelect={handleFileSelect} />

			{selectedFile && (
				<div className="mt-8 text-center">
					<div className="mb-4">
						<h3 className="text-lg font-semibold mb-2">Compression Level:</h3>
						<div className="flex justify-center gap-4">
							{(['low', 'medium', 'high'] as CompressionLevel[]).map((l) => (
								<label key={l} className="flex items-center space-x-2">
									<input
										type="radio"
										name="level"
										value={l}
										checked={level === l}
										onChange={() => setLevel(l)}
										className="form-radio h-5 w-5 text-blue-600"
									/>
									<span className="text-gray-700 capitalize">{l}</span>
								</label>
							))}
						</div>
					</div>
					<Button onClick={handleCompress} disabled={isLoading}>
						{isLoading ? 'Compressing...' : 'Compress PDF'}
					</Button>
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

export default CompressPdfPage;
