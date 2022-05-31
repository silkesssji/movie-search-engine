import React from 'react';

import app from "./app.module.scss";
import { Pagination } from '../pagination/pagination';
import { Movies } from '../movies/movies';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { Skeleton } from '../skeleton/skeleton';
import { Filters } from '../filters/filtres';
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
            totalPages: 1, 
            adult: false
        }
    }

    fetchData = async() => {
        this.setState({ loading: true })

        if (this.abort) {
            this.abort.abort();
        }

        this.abort = new AbortController();

        let requestedResponse;

        if (this.state.requestValue !== '') {
            requestedResponse = await api.search(this.state.requestValue, this.state.page, this.state.adult, this.abort.signal);
        } else {
            requestedResponse = await api.trends('day', this.state.page, this.abort.signal)
        }
        this.setState({
            totalPages: requestedResponse.total_pages,
            movies: requestedResponse.results,
        });
        this.setState({ loading: false });
        this.abort = null;
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
        const { page, requestValue, adult } = this.state;
        if (page !== prevState.page || requestValue !== prevState.requestValue || adult !==prevState.adult) {
            this.fetchData();
        }
    }

    handleCheckboxChange = (e) => {
        const value = e.target.value;
        if (value === "adult") {
            this.setState({ adult: !this.state.adult })
        }
    }

    componentDidMount = async () => {
        this.abort = new AbortController();
        this.setState({ loading: true });
        const requestedResponse = await api.trends('day', 1, this.abort.signal);
        this.setState({
            totalPages: requestedResponse.total_pages,
            movies: requestedResponse.results,
            loading: false,
            backgroundPath: requestedResponse.results[Math.floor(Math.random() * 20)].poster_path
        });
        this.abort = null;
    }

    render() {
        return (
            <>
                <Header backgroundPath={this.state.backgroundPath} changeRequest={this.changeRequest} />
                <main className={app.main}>
                    <div className={app.filtersWrapper}>
                        <Filters onChange={this.handleCheckboxChange}/>
                    </div>
                    <div className={app.wrapper}>
                        <Pagination
                            totalPages={this.state.totalPages}
                            page={this.state.page}
                            changePage={this.changePage}
                        />
                            {this.state.loading && Boolean(this.state.movies.length) && <Skeleton />}
                            {this.state.movies.length ? <Movies movies={this.state.movies}/>
                            : <div className={app.moviesNotFound}>Ничего не найдено</div>}
                        
                        <Pagination
                            totalPages={this.state.totalPages}
                            page={this.state.page}
                            changePage={this.changePage}
                        />
                    </div>
                    <div className={app.bgwrapper}>
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
                </main>
                <Footer />
            </>
        )
    }
}