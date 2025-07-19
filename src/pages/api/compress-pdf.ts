import type { NextApiRequest, NextApiResponse } from 'next';
import multiparty from 'multiparty';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const config = {
	api: {
		bodyParser: false,
	},
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const form = new multiparty.Form();

	form.parse(req, async (err: Error | null, fields, files) => {
		if (err) {
			return res.status(500).json({ error: `Error parsing form data: ${err.message}` });
		}

		if (!files.file || !files.file[0]) {
			return res.status(400).json({ error: 'No file uploaded.' });
		}

		const file = files.file[0];
		const level = fields.level ? fields.level[0] : 'medium';

		if (file.headers['content-type'] !== 'application/pdf') {
			return res.status(400).json({ error: 'File is not a PDF.' });
		}

		const tempDir = os.tmpdir();
		const inputPath = path.join(tempDir, `input-${Date.now()}.pdf`);
		const outputPath = path.join(tempDir, `output-${Date.now()}.pdf`);

		try {
			// 1. Save uploaded file to a temporary path
			const fileData = fs.readFileSync(file.path);
			fs.writeFileSync(inputPath, fileData);

			// 2. Define Ghostscript settings based on level
			let gsSettings = '-dPDFSETTINGS=/default';
			if (level === 'low') gsSettings = '-dPDFSETTINGS=/screen'; // 72 dpi
			if (level === 'medium') gsSettings = '-dPDFSETTINGS=/ebook'; // 150 dpi
			if (level === 'high') gsSettings = '-dPDFSETTINGS=/printer'; // 300 dpi

			// 3. Execute Ghostscript command
			const command = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 ${gsSettings} -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${outputPath} ${inputPath}`;

			await new Promise<void>((resolve, reject) => {
				exec(command, (error) => {
					if (error) {
						console.error('Ghostscript Error:', error);
						// Attempt to provide a more user-friendly error
						if (error.message.includes('command not found')) {
							return reject(
								new Error('Processing failed: Ghostscript might not be installed on the server.')
							);
						}
						return reject(error);
					}
					resolve();
				});
			});

			// 4. Read the compressed file
			const compressedPdfBuffer = fs.readFileSync(outputPath);

			// 5. Send response
			res.setHeader('Content-Type', 'application/pdf');
			res.setHeader(
				'Content-Disposition',
				`attachment; filename="compressed-${file.originalFilename}"`
			);
			res.status(200).send(compressedPdfBuffer);
		} catch (error) {
			console.error(error);
			res
				.status(500)
				.json({ error: error instanceof Error ? error.message : 'Error compressing PDF' });
		} finally {
			// 6. Clean up temporary files
			if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
			if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
		}
	});
};

export default handler;
