import React, {useEffect, useState} from 'react';
import {
	fetchAllCenturies,
	fetchAllClassifications,
	fetchAllMediums,
	fetchQueryResults
} from '../api';

const Search = ({setIsLoading, setSearchResults, setFeaturedResult}) => {
	const [centuryList, setCenturyList] = useState([]);
	const [classificationList, setClassificationList] = useState([]);
	const [mediumList, setMediumList] = useState([]);
	const [searchSuggestions, setSearchSuggestions] = useState([]);
	const [queryString, setQueryString] = useState('');
	const [century, setCentury] = useState('any');
	const [classification, setClassification] = useState('any');
	const [medium, setMedium] = useState('any');

	const fetchSearchSuggestions = async () => {
		const {records} = await fetchQueryResults({century, classification, medium, queryString});
		setSearchSuggestions(records);
	}

	useEffect(() => {
		Promise.all([
			fetchAllCenturies(),
			fetchAllClassifications(),
			fetchAllMediums()
		])
			.then(([centuries, classifications, mediums]) => {
				setCenturyList(centuries);
				setClassificationList(classifications);
				setMediumList(mediums);
			})
			.catch(error => { console.error(error) })
	}, []);

	return <form id="search" onSubmit={async (event) => {
		event.preventDefault()
		setIsLoading(true)
		try {
			let results = await fetchQueryResults({ century, classification, medium, queryString })
			setSearchResults(results)
		} catch (error) {
			console.error(error)
		} finally {
			setIsLoading(false)
		}
	}}>
		<fieldset>
			<label htmlFor="keywords">Query</label>
			<input
				id="keywords"
				type="text"
				placeholder="enter keywords..."
				value={queryString}
				onChange={(event) => {
					setQueryString(event.target.value);
					fetchSearchSuggestions();
				}} />
			<ul id="suggestion-list">
				{
					searchSuggestions.map(suggestion => <li
						key={suggestion.objectid}
						onClick={async () => {
							setFeaturedResult(suggestion);
							setSearchSuggestions([]);
							const results = await fetchQueryResults({ century, classification, medium, queryString });
							setSearchResults(results);
						}}>
						{suggestion.title}
					</li>)
				}
			</ul>
		</fieldset>
		<fieldset>
			<label htmlFor="select-classification">Classification
				<span className="classification-count">({classificationList.length})</span>
			</label>
			<select
				name="classification"
				id="select-classification"
				value={classification}
				onChange={(event) => setClassification(event.target.value)}>
				<option value="any">Any</option>
				{classificationList.map((classification, index) =>
					<option value={classification.name} key={`${index}:${classification.name}`}>{classification.name}</option>)
				}
			</select>
		</fieldset>
		<fieldset>
			<label htmlFor="select-century">Century
				<span className="century-count">({centuryList.length})</span>
			</label>
			<select
				name="century"
				id="select-century"
				value={century}
				onChange={(event) => setCentury(event.target.value)}>
				<option value="any">Any</option>
				{centuryList.map((century, index) =>
					<option value={century.name} key={`${index}:${century.name}`}>{century.name}</option>)
				}
			</select>
		</fieldset>
		<fieldset>
			<label htmlFor="select-medium">
				Medium <span className="medium-count">({mediumList.length})</span>
			</label>
			<select
				name="medium"
				id="select-medium"
				value={medium}
				onChange={(event) => setMedium(event.target.value)}>
				<option value="any">Any</option>
				{mediumList.map((medium, idx) =>
					<option key={`${idx}:${medium.name}`} value={medium.name}>
						{medium.name}
					</option>
				)}
			</select>
		</fieldset>
		<button>SEARCH</button>
	</form>
}

export default Search;