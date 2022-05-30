import React from 'react';

import app from "./app.module.scss";
import { Pagination } from '../pagination/pagination';
import { Movies } from '../movies/movies';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { Skeleton } from '../skeleton/skeleton';
import { debounce } from '../../lib/debounce';
import { api } from '../../lib/api';

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            movies: [],
            page: 1,
            backgroundPath: '',
            requestValue: '',
            totalPages: 1
        }
    }

    fetchData = async () => {
        this.setState({ loading: true });
        let requestedResponse;
        if (this.state.requestValue !== '') {
            requestedResponse = await api.search(this.state.requestValue, this.state.page)
        } else {
            requestedResponse = await api.trends('day', this.state.page)
        }
        this.setState({
            totalPages: requestedResponse.total_pages,
            movies: requestedResponse.results,
        });
        this.setState({ loading: false });
    }

    changePage = (page) => {
        this.setState({ page });
    }

    changeRequest = debounce((e) => {
        e.preventDefault();
        if (e.target.value.replace(/\s/g, '') !== '') {
            this.setState({
                page: 1,
                requestValue: e.target.value
            });
        } else {
            this.setState({ requestValue: '' });
        }
    }, 300)

    componentDidUpdate(_, prevState) {
        const { page, requestValue } = this.state;
        if (page !== prevState.page || requestValue !== prevState.requestValue) {
            this.fetchData();
        }
    }

    componentDidMount = async () => {
        this.fetchData();
        let popularMoviesResponce = await fetch(
            `https://api.themoviedb.org/3/trending/movie/day?api_key=00479108b898bdd0ebeed080d6bd33fe&page=${this.state.page}`
        );
        let popularMovies = await popularMoviesResponce.json();
        this.setState({ backgroundPath: popularMovies.results[Math.floor(Math.random() * 20)].poster_path });
    }

    render() {
        return (
            <>
                <Header backgroundPath={this.state.backgroundPath} changeRequest={this.changeRequest} />
                <main className={app.main}>
                    <Pagination
                        totalPages={this.state.totalPages}
                        page={this.state.page}
                        changePage={this.changePage}
                    />
                    {
                        this.state.loading ? <Skeleton /> :
                            <Movies movies={this.state.movies} />
                    }
                    <div className={app.bgwrapper}>
                        <div className={app.smoke} />
                        <div className={app.bg}
                            style={
                                {
                                    backgroundImage:
                                        this.state.backgroundPath.length ? (
                                            `url(https://image.tmdb.org/t/p/original/${this.state.backgroundPath}`
                                        ) : (
                                            "none"
                                        )
                                }
                            }
                        />
                    </div>
                    <Pagination
                        totalPages={this.state.totalPages}
                        page={this.state.page}
                        changePage={this.changePage}
                    />
                </main>
                <Footer />
            </>
        )
    }
}