import React from 'react';
import {fetchQueryResultsFromURL} from '../api';

const Preview = ({setSearchResults, setFeaturedResult, setIsLoading, searchResults: {info, records}}) => {
	async function fetchPage(pageUrl) {
		setIsLoading(true);
		try {
			let results = await fetchQueryResultsFromURL(pageUrl);
			setSearchResults(results);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}
	return <aside id="preview">
		<header className="pagination">
			<button
				disabled={!info.prev}
				className="previous"
				onClick={() => fetchPage(info.prev)}>Previous
			</button>
			<button
				disabled={!info.next}
				className="next"
				onClick={() => fetchPage(info.next)}>Next
			</button>
		</header>
		<section className="results">
			{records.map((record, index) =>
				<div
					key={index}
					className="object-preview"
					onClick={(event) => {
						event.preventDefault();
						setFeaturedResult(record)
					}}>
					{record.primaryimageurl
						? <img src={record.primaryimageurl} alt={record.description} />
						: null}
					{record.title
						? <h3>{record.title}</h3>
						: <h3>{info}</h3>}
				</div>)}
		</section>
	</aside>
}

export default Preview;