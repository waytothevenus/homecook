import Tippy from '@tippyjs/react';

function Tooltip({ content, children }) {
	return (
		<Tippy
			// theme="light"
			content={<span className="text-xl">{content}</span>}
		>
			{children}
		</Tippy>
	);
}

export default Tooltip;
