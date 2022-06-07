import React from 'react';
import moviesStyle from './movies.module.scss'
import { Card } from '../card/card';

export const Movies = ({
    movies
}) => {
    return (
        <div className={moviesStyle.cardWrapper}>
            {movies.length !== 0 && movies
                .map((item, index) => (
                    <Card data={item} key={index} />
                )
                )}
        </div>
    )
}