import React from 'react';
import card from './card.module.scss'

export const Card = ({
    data
}) => {
    return (<div className={card.cardContainer}>
        <div className={card.card}>
            {data.poster_path ? <img className={card.cardPoster} src={
                `https://image.tmdb.org/t/p/w780/${data.poster_path}`} /> :
                <div className={card.posterNotFound}>Not Found</div>}
        </div>
        <div className={card.cardHeading}>
            <h2 className={card.cardTitle}>
                {data.title && `${data.title} `}
                {data.release_date && `(${data.release_date.split("-")[0]})`}
            </h2>
        </div>
    </div>
    )
}