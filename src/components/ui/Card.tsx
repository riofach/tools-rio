import Link from 'next/link';
import React from 'react';

type CardProps = {
	href: string;
	title: string;
	description: string;
};

const Card = ({ href, title, description }: CardProps) => {
	return (
		<Link
			href={href}
			className="block p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
		>
			<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{title}</h5>
			<p className="font-normal text-gray-700">{description}</p>
		</Link>
	);
};

export default Card;
