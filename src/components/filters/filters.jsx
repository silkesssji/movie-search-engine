import React from 'react';
import filters from './filters.module.scss';
import { Checkbox } from '../checkbox/checkbox';

export const Filters = ({
    adult, onChange, existingGenres, choosedGenres
}) => {
    return (
        <div className={filters.container}>
            <h2 className={filters.heading}>
                Adult
            </h2>
            <Checkbox id='checkboxFilterPanel1'
                label="Adult"
                checked={adult}
                value="adult"
                onChange={onChange}
            />
            <h2 className={filters.heading}>
                Genres
            </h2>
            <Checkbox id='checkboxAllFilters'
                label='All Genres'
                checked={existingGenres.every((elem) => choosedGenres.includes(elem))}
                value='All'
                onChange={onChange}
            />
            {existingGenres && existingGenres.map((elem, index) =>
                <Checkbox id={`checkbox${index}`}
                    key={index}
                    label={elem}
                    checked={choosedGenres.includes(elem)}
                    value={elem}
                    onChange={onChange}
                />
            )}
        </div>
    )
}