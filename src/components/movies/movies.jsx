import React from 'react';
import movies from './modules/movies.module.scss'

export class Movies extends React.Component {
    render() {
        return (
            <div className={movies.cardWrapper}>
                {this.props.movies.length !==0 &&
                this.props.movies.map((result, index) => {
                    return (<div key={index} className={movies.cardContainer}>
                                <div className={movies.card}>
                                    {result.poster_path ? <img className={movies.cardPoster} src={
                                    `https://image.tmdb.org/t/p/w780/${result.poster_path}`}/> : 
                                    <div className={movies.posterNotFound}>Not Found</div>}
                                </div>
                                <div className={movies.cardHeading}>
                                    <h2 className={movies.cardTitle}>
                                        {result.title && `${result.title} `}
                                        {result.release_date && `(${result.release_date.split("-")[0]})`}
                                    </h2>
                                </div>
                            </div>)
                        }
                    )
                }
            </div>
        )
    }
}