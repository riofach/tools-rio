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

		if (!fields.format || !fields.format[0]) {
			return res.status(400).json({ error: 'Output format not specified.' });
		}

		const file = files.file[0];
		const format = fields.format[0] as 'jpeg' | 'png' | 'webp';

		let processor;
		switch (format) {
			case 'jpeg':
				processor = sharp(file.path).jpeg();
				break;
			case 'png':
				processor = sharp(file.path).png();
				break;
			case 'webp':
				processor = sharp(file.path).webp();
				break;
			default:
				return res.status(400).json({ error: `Unsupported output format: ${format}` });
		}

		try {
			const convertedImageBuffer = await processor.toBuffer();
			const originalFilename = file.originalFilename.substring(
				0,
				file.originalFilename.lastIndexOf('.')
			);

			res.setHeader('Content-Type', `image/${format}`);
			res.setHeader('Content-Disposition', `attachment; filename="${originalFilename}.${format}"`);
			res.status(200).send(convertedImageBuffer);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Error converting image' });
		}
	});
};

export default handler;
