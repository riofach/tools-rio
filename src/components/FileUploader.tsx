import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

type FileUploaderProps = {
	onFileSelect: (file: File) => void;
};

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			if (acceptedFiles && acceptedFiles.length > 0) {
				const file = acceptedFiles[0];
				setSelectedFile(file);
				onFileSelect(file);
			}
		},
		[onFileSelect]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		multiple: false,
	});

	return (
		<div {...getRootProps()} className="flex items-center justify-center w-full">
			<label
				htmlFor="dropzone-file"
				className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
					isDragActive ? 'border-blue-500' : 'border-gray-300'
				}`}
			>
				<div className="flex flex-col items-center justify-center pt-5 pb-6">
					<svg
						className="w-8 h-8 mb-4 text-gray-500"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 20 16"
					>
						<path
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
						/>
					</svg>
					{selectedFile ? (
						<p className="font-semibold text-lg text-gray-700">{selectedFile.name}</p>
					) : (
						<>
							<p className="mb-2 text-sm text-gray-500">
								<span className="font-semibold">Click to upload</span> or drag and drop
							</p>
							<p className="text-xs text-gray-500">
								Supported formats and size limits will be shown here.
							</p>
						</>
					)}
				</div>
				<input {...getInputProps()} id="dropzone-file" />
			</label>
		</div>
	);
};

export default FileUploader;
