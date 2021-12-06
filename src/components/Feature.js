import React, { Fragment } from 'react';

// Don't touch this import
import { fetchQueryResultsFromTermAndValue } from '../api';

/**
 * We need a new component called Searchable which:
 * 
 * Has a template like this:
 * 
 * <span className="content">
 *  <a href="#" onClick={async (event) => {}}>SOME SEARCH TERM</a>
 * </span>
 *
 * You'll need to read searchTerm, searchValue, setIsLoading, and setSearchResults off of the props.
 * 
 * When someone clicks the anchor tag, you should:
 * 
 * - preventDefault on the event
 * - call setIsLoading, set it to true
 * 
 * Then start a try/catch/finally block:
 * 
 * try:
 *  - await the result of fetchQueryResultsFromTermAndValue, passing in searchTerm and searchValue
 *  - send the result to setSearchResults (which will update the Preview component)
 * catch: 
 *  - console.error the error
 * finally:
 *  - call setIsLoading, set it to false
 */
const Searchable = ({searchTerm, searchValue, setIsLoading, setSearchResults}) => {
	return (
		<span className="content">
			<a href="#" onClick={async (event) => {
				event.preventDefault();
				setIsLoading(true);
				try {
					let results = await fetchQueryResultsFromTermAndValue(searchTerm, searchValue);
					setSearchResults(results)
				} catch (error) {
					console.error(error);
				} finally {
					setIsLoading(false)
				}
			}}>{searchTerm}</a>
		</span>
	)
}

/**
 * We need a new component called Feature which looks like this when no featuredResult is passed in as a prop:
 * 
 * <main id="feature"></main>
 * 
 * And like this when one is:
 * 
 * <main id="feature">
 *   <div className="object-feature">
 *     <header>
 *       <h3>OBJECT TITLE</h3>
 *       <h4>WHEN IT IS DATED</h4>
 *     </header>
 *     <section className="facts">
 *       <span className="title">FACT NAME</span>
 *       <span className="content">FACT VALUE</span>
 *       <span className="title">NEXT FACT NAME</span>
 *       <span className="content">NEXT FACT VALUE</span>
 *     </section>
 *     <section className="photos">
 *       <img src=IMAGE_URL alt=SOMETHING_WORTHWHILE />
 *     </section>
 *   </div>
 * </main>
 * 
 * The different facts look like this: title, dated, images, primaryimageurl, description, culture, style, 
 * technique, medium, dimensions, people, department, division, contact, creditline
 * 
 * The <Searchable /> ones are: culture, technique, medium (first toLowerCase it), and person.displayname (one for each PEOPLE)
 * 
 * NOTE: people and images are likely to be arrays, and will need to be mapped over if they exist
 * 
 * This component should be exported as default.
 */
const Feature = (props) => {
	const { featuredResult } = props;
	return (featuredResult)
		? <>
			<main id="feature">
				<div className="object-feature">
					<header>
						<h3>{featuredResult.title}</h3>
						<h4>{featuredResult.dated}</h4>
					</header>
					<section className="facts">
						<span className="title">{featuredResult.description}</span>
						<span className="content"> STYLE: {featuredResult.style}</span>
						<span className="content"> DIMENSIONS: {featuredResult.dimensions}</span>
						<span className="content">{featuredResult.division}</span>
						<span className="content"> CONTACT: {featuredResult.contact}</span>
						<span className="content"> CREDIT: {featuredResult.creditline}</span>
						<>
							<span className="content"> CULTURE: <Searchable
								searchTerm={featuredResult.culture}
								searchValue={featuredResult.culture}
								{...props} />
							</span>
						</>
						<>
							<span className="content"> TECHNIQUE: <Searchable
								searchTerm={featuredResult.technique}
								searchValue={featuredResult.technique}
								{...props} />
							</span>
						</>
						<>
							<span className="content"> MEDIUM: <Searchable
								searchTerm={featuredResult.medium}
								searchValue={featuredResult.medium}
								{...props} />
							</span>
						</>
						<>
							<span className="content"> PEOPLE(S):
								{featuredResult.people
									? featuredResult.people.map((person, index) => {
										return <span
											key={`${person} ${index}`}
											className="content">
											<Searchable
												searchTerm={featuredResult.people.displayname}
												searchValue={featuredResult.people.displayname}
												{...props}

												{...featuredResult.people.displayname
													? featuredResult.people.displayname
													: null
												}
											/> </span>
									})
									: null}
							</span>
						</>
					</section>
					<section className="photos">
						{featuredResult.images
							? featuredResult.images.map((primaryimageurl, index) => {
								return <div
									key={`${primaryimageurl} ${index}`}
									className="photos">
									{featuredResult.primaryimageurl
										? <img src={featuredResult.primaryimageurl} alt={featuredResult.description} />
										: null}
								</div>
							})
							: null}
					</section>
				</div>
			</main>
		</> : <main id="feature"></main>
}

export default Feature;