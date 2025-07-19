import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, File, X, CheckCircle, AlertCircle, FileImage, FileText } from 'lucide-react';

type FileUploaderProps = {
	onFileSelect: (file: File) => void;
	acceptedTypes?: string[];
	maxSize?: number;
	placeholder?: string;
};

const FileUploader = ({
	onFileSelect,
	acceptedTypes,
	maxSize = 10 * 1024 * 1024, // 10MB default
	placeholder = 'Upload your file to get started',
}: FileUploaderProps) => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [error, setError] = useState<string | null>(null);

	const onDrop = useCallback(
		(acceptedFiles: File[], rejectedFiles: any[]) => {
			if (rejectedFiles.length > 0) {
				const rejection = rejectedFiles[0];
				if (rejection.errors.some((e: any) => e.code === 'file-too-large')) {
					setError(`File is too large. Maximum size is ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
				} else if (rejection.errors.some((e: any) => e.code === 'file-invalid-type')) {
					setError('Invalid file type. Please check supported formats.');
				} else {
					setError('File upload failed. Please try again.');
				}
				return;
			}

			if (acceptedFiles && acceptedFiles.length > 0) {
				const file = acceptedFiles[0];
				setSelectedFile(file);
				setError(null);
				onFileSelect(file);
			}
		},
		[onFileSelect, maxSize]
	);

	const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
		onDrop,
		multiple: false,
		maxSize,
		accept: acceptedTypes ? Object.fromEntries(acceptedTypes.map((type) => [type, []])) : undefined,
	});

	const removeFile = (e: React.MouseEvent) => {
		e.stopPropagation();
		setSelectedFile(null);
		setError(null);
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	const getFileIcon = (file: File) => {
		if (file.type.startsWith('image/')) {
			return <FileImage className="h-8 w-8 text-green-500" />;
		} else if (file.type === 'application/pdf') {
			return <FileText className="h-8 w-8 text-red-500" />;
		}
		return <File className="h-8 w-8 text-blue-500" />;
	};

	const getBorderColor = () => {
		if (isDragReject || error) return 'border-red-300 bg-red-50';
		if (isDragActive) return 'border-blue-400 bg-blue-50';
		if (selectedFile) return 'border-green-300 bg-green-50';
		return 'border-slate-300 hover:border-slate-400';
	};

	return (
		<div className="w-full space-y-4">
			<Card className={`transition-all duration-200 ${getBorderColor()}`}>
				<CardContent className="p-0">
					<div {...getRootProps()} className="cursor-pointer">
						<input {...getInputProps()} />

						{!selectedFile ? (
							<div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
								<div
									className={`p-4 rounded-full transition-colors ${
										isDragActive ? 'bg-blue-100' : 'bg-slate-100'
									}`}
								>
									<Upload
										className={`h-8 w-8 transition-colors ${
											isDragActive ? 'text-blue-600' : 'text-slate-400'
										}`}
									/>
								</div>

								<div className="space-y-2">
									<h3 className="text-lg font-semibold text-slate-900">
										{isDragActive ? 'Drop your file here' : 'Choose file or drag & drop'}
									</h3>
									<p className="text-slate-500">{placeholder}</p>
								</div>

								{acceptedTypes && (
									<div className="flex flex-wrap gap-2 justify-center">
										{acceptedTypes.map((type, index) => (
											<Badge key={index} variant="secondary" className="text-xs">
												{type.split('/')[1]?.toUpperCase() || type}
											</Badge>
										))}
									</div>
								)}

								<p className="text-xs text-slate-400">
									Maximum file size: {(maxSize / 1024 / 1024).toFixed(1)}MB
								</p>
							</div>
						) : (
							<div className="p-6">
								<div className="flex items-center space-x-4">
									{getFileIcon(selectedFile)}
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-slate-900 truncate">
											{selectedFile.name}
										</p>
										<p className="text-sm text-slate-500">{formatFileSize(selectedFile.size)}</p>
									</div>
									<div className="flex items-center space-x-2">
										<CheckCircle className="h-5 w-5 text-green-500" />
										<button
											onClick={removeFile}
											className="p-1 hover:bg-slate-100 rounded-full transition-colors"
											type="button"
										>
											<X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{error && (
				<div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
					<AlertCircle className="h-5 w-5 text-red-500" />
					<p className="text-sm text-red-700">{error}</p>
				</div>
			)}
		</div>
	);
};

export default FileUploader;
