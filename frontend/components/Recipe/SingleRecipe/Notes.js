import Title from '@components/UI/Title';

function Notes({ notes }) {
	return notes ? (
		<div>
			<Title
				title="NOTES"
				bottom="mb-3"
			/>
			<p className="first-letter:uppercase">{notes}</p>
		</div>
	) : (
		<></>
	);
}

export default Notes;
