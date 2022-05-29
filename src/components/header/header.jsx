import React from 'react';
import header from "./modules/header.module.scss";

export const Header = ({
    backgroundPath, changeRequest
}) => {
    return(
        <header className={header.header}
            style={
                {
                    backgroundImage:
                        backgroundPath.length ? (
                            `url(https://image.tmdb.org/t/p/original/${backgroundPath}`
                        ) : (
                            "none"
                        ),
                    transition: 'background-image 1s ease',
                }
            }
        >
            <h1 className={header.heading}>MOVIESEARCH</h1>
            <input
                className={header.input}
                type="search"
                placeholder='Search'
                autoComplete="on"
                onChange={changeRequest}
            />
        </header>
    )
}