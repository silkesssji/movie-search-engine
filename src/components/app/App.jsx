import React from 'react';

import main from "./modules/main.module.scss";
import header from "./modules/header.module.scss";
import footer from "./modules/footer.module.scss";
import logo from '../../img/logo.svg';
import { Pagination } from '../pagination/pagination';
import { Movies } from '../movies/movies'

function debounce(fn, delay) {
    let timer = null;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
}



export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            movies: [],
            page: 1,
            popularBGs: [],
            currentBG: '',
            requestValue: '',
            totalPages: 1
        }
    }

    fetchData = async () => {
        if (this.state.requestValue !== '') {
            const response = await fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=00479108b898bdd0ebeed080d6bd33fe&language=en-US&query=${this.state.requestValue}&page=${this.state.page}&include_adult=false`
            );
            const json = await response.json();
            this.setState({ totalPages: json.total_pages });
            this.setState({ movies: json.results });
        } else {
            const response = await fetch(
                `https://api.themoviedb.org/3/trending/movie/day?api_key=00479108b898bdd0ebeed080d6bd33fe&page=${this.state.page}`
            );
            const json = await response.json();
            this.setState({ totalPages: json.total_pages });
            this.setState({ movies: json.results });
        }
    }

    changePage = (page) => {
        this.setState({ page })
    }

    changeRequest = debounce((e) => {
        e.preventDefault();
        if (!(e.target.value.replace(/\s/g, '') === '')) {
            // this.setState({page: 1})
            this.setState({ requestValue: e.target.value });
            this.setState({ pages: [1, 2, 3, 4, 5] })
        } else {
            this.setState({ requestValue: '' });
        }
    }, 300)

    componentDidUpdate(prevProps, prevState) {
        const { page, requestValue } = this.state;
        if (page !== prevState.page || requestValue !== prevState.requestValue) {
            this.fetchData();
        }
    }

    componentDidMount = async () => {
        const response = await fetch(
            `https://api.themoviedb.org/3/trending/movie/week?api_key=00479108b898bdd0ebeed080d6bd33fe&language=en-US&page=${this.state.page}`
        );
        const json = await response.json();
        this.setState({ movies: json.results });
        let bgNumber = Math.floor(Math.random() * 20);
        this.setState({ popularBGs: json.results.map(card => card.backdrop_path) }, () => {
            this.setState({ currentBG: this.state.popularBGs[bgNumber] })
        });
        this.setState({ totalPages: json.total_pages }, () => this.fetchData());
    }

    render() {
        return (
            <>
                <header className={header.header} style={
                    {
                        backgroundImage:
                            this.state.popularBGs.length ?
                                `url(https://image.tmdb.org/t/p/original/${this.state.currentBG})`
                                : "none",
                        transition: 'background-image 1s ease',
                    }
                }>
                    <h1 className={header.heading}>MOVIESEARCH</h1>
                    <input
                        className={header.input}
                        type="search"
                        placeholder='Search'
                        autoComplete="on"
                        onChange={this.changeRequest}
                    />
                </header>
                <main className={main.main}>
                    <Pagination totalPages={this.state.totalPages} page={this.state.page} changePage={this.changePage}/>
                    <Movies movies={this.state.movies} />
                    <div className={main.bgwrapper}>
                        <div className={main.smoke} />
                        <div className={main.bg} style={
                            {
                                backgroundImage:
                                    this.state.popularBGs.length ?
                                        `url(https://image.tmdb.org/t/p/w300/${this.state.currentBG})`
                                        : "none",
                                transition: 'background-image 0.5s ease',
                            }
                        } />
                    </div>
                    <Pagination totalPages={this.state.totalPages} page={this.state.page} changePage={this.changePage}/>
                </main>
                <footer className={footer.footer}>
                    <div className={footer.wrapper}>
                        <a className={footer.link} href='https://www.themoviedb.org/'><img src={logo} alt="logo" width='200px' /></a>
                        <a className={footer.link} href='https://github.com/silkesssji'>Silkessji GitHub</a>
                        <a className={footer.link} href='https://github.com/silkesssji/movie-search-engine'>Repository</a>
                        <a className={footer.link} href='https://www.themoviedb.org/'>MovieDB</a>
                    </div>
                </footer>
            </>
        )
    }
}