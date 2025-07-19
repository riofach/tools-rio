import type { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import multiparty from 'multiparty';

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
		const quality = fields.quality && fields.quality[0] ? parseInt(fields.quality[0], 10) : 80;
		const originalMimeType = file.headers['content-type'];
		const originalExtension = file.originalFilename.split('.').pop();

		let processor;
		switch (originalMimeType) {
			case 'image/jpeg':
				processor = sharp(file.path).jpeg({ quality });
				break;
			case 'image/png':
				processor = sharp(file.path).png({ quality });
				break;
			case 'image/webp':
				processor = sharp(file.path).webp({ quality });
				break;
			default:
				return res.status(400).json({ error: `Unsupported file type: ${originalMimeType}` });
		}

		try {
			const compressedImageBuffer = await processor.toBuffer();

			res.setHeader('Content-Type', originalMimeType);
			res.setHeader(
				'Content-Disposition',
				`attachment; filename="compressed-${file.originalFilename}"`
			);
			res.status(200).send(compressedImageBuffer);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Error compressing image' });
		}
	});
};

export default handler;
