import type { NextPage } from 'next';
import { useState } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import FileUploader from '../components/FileUploader';
import Button from '../components/ui/Button';

const CompressImagePage: NextPage = () => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [quality, setQuality] = useState(80);
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
		formData.append('quality', quality.toString());

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

	return (
		<div className="container mx-auto max-w-5xl">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold mb-2">Compress Image</h1>
				<p className="text-lg text-gray-600">
					Upload an image, adjust the quality, and compare the result with our interactive slider.
				</p>
			</div>

			{!selectedFile ? (
				<FileUploader onFileSelect={handleFileSelect} />
			) : (
				<div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
					{originalPreview && compressedPreview ? (
						<ReactCompareSlider
							itemOne={<ReactCompareSliderImage src={originalPreview} alt="Original Image" />}
							itemTwo={<ReactCompareSliderImage src={compressedPreview} alt="Compressed Image" />}
							className="w-full h-auto rounded-lg overflow-hidden"
						/>
					) : (
						originalPreview && (
							<img
								src={originalPreview}
								alt="Original Preview"
								className="w-full h-auto rounded-lg mx-auto"
							/>
						)
					)}

					<div className="mt-6 flex flex-col items-center">
						{/* Size Info */}
						<div className="flex justify-around w-full max-w-md text-center mb-4">
							<div>
								<p className="font-medium">Original Size</p>
								<p className="text-gray-600">{(selectedFile.size / 1024).toFixed(2)} KB</p>
							</div>
							{compressedSize && (
								<div>
									<p className="font-medium">Compressed Size</p>
									<p className="text-gray-600">
										{(compressedSize / 1024).toFixed(2)} KB
										<span className="ml-2 font-semibold text-green-600">
											(-
											{(((selectedFile.size - compressedSize) / selectedFile.size) * 100).toFixed(
												0
											)}
											%)
										</span>
									</p>
								</div>
							)}
						</div>

						{/* Controls */}
						<div className="mb-4 w-full max-w-md">
							<label htmlFor="quality" className="form-label font-medium">
								Quality: {quality}%
							</label>
							<input
								type="range"
								id="quality"
								min="10"
								max="100"
								value={quality}
								onChange={(e) => setQuality(parseInt(e.target.value, 10))}
								className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
								disabled={isLoading}
							/>
						</div>

						<div className="flex gap-4">
							<Button onClick={handleCompress} disabled={isLoading}>
								{isLoading ? 'Compressing...' : 'Compress'}
							</Button>
							{compressedPreview && <Button onClick={handleDownload}>Download</Button>}
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

export default CompressImagePage;
