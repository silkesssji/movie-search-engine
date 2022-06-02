import React from 'react';
import moviesStyle from './movies.module.scss'

export const Movies = ({
    movies
}) => {
    return (
        <div className={moviesStyle.cardWrapper}>
            {movies.length !== 0 && movies
                .map((result, index) => {
                    return (
                        <div key={index} className={moviesStyle.cardContainer}>
                            <div className={moviesStyle.card}>
                                {result.poster_path ? <img className={moviesStyle.cardPoster} src={
                                    `https://image.tmdb.org/t/p/w780/${result.poster_path}`} /> :
                                    <div className={moviesStyle.posterNotFound}>Not Found</div>}
                            </div>
                            <div className={moviesStyle.cardHeading}>
                                <h2 className={moviesStyle.cardTitle}>
                                    {result.title && `${result.title} `}
                                    {result.release_date && `(${result.release_date.split("-")[0]})`}
                                </h2>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}