type MessagePencilIconProps = {
	className?: string;
}

function MessagePencilIcon({ className = "" }: MessagePencilIconProps) {
	return (
		<svg
			id="Pencil-Message--Streamline-Atlas"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="-0.5 -0.5 16 16"
			height={16}
			width={16}
			className={className}
		>
			<desc>
				{
					"\n    Pencil Message Streamline Icon: https://streamlinehq.com\n  "
				}
			</desc>
			<defs />
			<path
				d="M7.5 7.5a4.33125 4.33125 0 0 1 1.25 -3.05625l2.9125 -2.9125a1.25 1.25 0 0 1 1.7937500000000002 0 1.25 1.25 0 0 1 0 1.7937500000000002L10.55625 6.25A4.325 4.325 0 0 1 7.5 7.5Z"
				fill="none"
				stroke="#000000"
				strokeMiterlimit={10}
				strokeWidth={1}
			/>
			<path
				d="M9.2875 0.925H3.325A2.3874999999999997 2.3874999999999997 0 0 0 0.9375 3.3125v5.9624999999999995a2.3874999999999997 2.3874999999999997 0 0 0 2.3874999999999997 2.3874999999999997h1.1937499999999999v1.7874999999999999L8.125 11.6625h3.5812500000000003a2.3874999999999997 2.3874999999999997 0 0 0 2.3874999999999997 -2.3874999999999997V5.69375"
				fill="none"
				stroke="#000000"
				strokeMiterlimit={10}
				strokeWidth={1}
			/>
		</svg>
	);
}

export default MessagePencilIcon;