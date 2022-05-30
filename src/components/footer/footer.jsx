import React from 'react';
import footer from "./footer.module.scss";
import logo from '../../img/logo.svg';

export const Footer = () => {
    return(
        <footer className={footer.footer}>
                <div className={footer.wrapper}>
                    <a
                        className={footer.link}
                        href='https://www.themoviedb.org/'
                    >
                        <img src={logo} alt="logo" width='200px' />
                    </a>
                    <a
                        className={footer.link}
                        href='https://github.com/silkesssji'
                    >
                        Silkessji GitHub
                    </a>
                    <a
                        className={footer.link}
                        href='https://github.com/silkesssji/movie-search-engine'
                    >
                        Repository
                    </a>
                    <a
                        className={footer.link}
                        href='https://www.themoviedb.org/'
                    >
                        MovieDB
                    </a>
                </div>
        </footer>
    )
}