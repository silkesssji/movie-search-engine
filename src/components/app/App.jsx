import React from 'react';

import app from "./app.module.scss";
import { Pagination } from '../pagination/pagination';
import { Movies } from '../movies/movies';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { Skeleton } from '../skeleton/skeleton';
import { Filters } from '../filters/filters';
import { debounce } from '../../lib/debounce';
import { api } from '../../lib/api';
import { getRandomInteger } from '../../lib/getRandomInteger';

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            movies: [],
            page: 1,
            backgroundPath: '',
            requestValue: '',
            totalPages: 1,
            adult: false,
            loading: false,
            allGenres: true,
            choosedGenres: [],
        }
    }

    fetchData = async () => {
        this.setState({ loading: true });
        if (this.abort) {
            this.abort.abort();
        }

        this.abort = new AbortController();

        let fetchedMovies;

        if (this.state.requestValue !== '') {
            fetchedMovies = await api.search(this.state.requestValue, this.state.page, this.state.adult, this.abort.signal);
        } else {
            fetchedMovies = await api.trends('day', this.state.page, this.abort.signal);
        }

        this.setState({
            totalPages: fetchedMovies.total_pages,
            movies: fetchedMovies.results,
            loading: false
        });
        this.abort = null;
    }

    changePage = (page) => {
        this.setState({ page });
    }

    changeRequest = debounce((e) => {
        if (e.target.value.replace(/\s/g, '')) {
            this.setState({
                page: 1,
                requestValue: e.target.value,
            });
        } else {
            this.setState({ requestValue: '' });
        }
    }, 300)

    componentDidUpdate(_, prevState) {
        const { page, requestValue, adult, loading, choosedGenres } = this.state;
        if (page !== prevState.page || requestValue !== prevState.requestValue || (adult !== prevState.adult && requestValue !== '')) {
            this.fetchData();
        }
        if (loading) {
            return false;
        }
    }

    handleCheckboxChange = (e) => {
        const value = e.target.value;
        if (value === "adult") {
            this.setState({ adult: !this.state.adult })
        } else if (value === "All") {
            this.setState({
                allGenres: !this.state.allGenres,
                choosedGenres: [...this.genres]
            }, () => {
                if (this.state.allGenres) {
                    this.setState({ choosedGenres: [...this.genres] })
                } else {
                    this.setState({ choosedGenres: [] })
                }
            })
        } else {
            if (this.state.choosedGenres.includes(value)) {
                this.setState({ choosedGenres: this.state.choosedGenres.filter((elem) => elem !== value) })
            } else {
                this.setState({ choosedGenres: [...this.state.choosedGenres, e.target.value] })
            }
        }
        this.setState({ page: 1 })
    }

    getGenres = async () => {
        const json = await api.getGenres();
        const genres = json.genres;
        this.genres = [...genres.map((elem) => elem.name)];
    }

    componentDidMount = async () => {
        this.setState({ loading: true });
        await this.getGenres();
        const requestedResponse = await api.trends('day', 1);
        this.setState({
            totalPages: requestedResponse.total_pages,
            movies: requestedResponse.results,
            backgroundPath: requestedResponse.results[getRandomInteger(0, 20)].poster_path,
            loading: false,
        });
        if (this.state.allGenres) {
            this.setState({ choosedGenres: [...this.genres] })
        }
        for (const param of this.props.queryParams) {
            console.log(param)
        }
    }

    render() {
        const haveMovies = Boolean(this.state.movies.length)
        return (
            <>
                <Header
                    backgroundPath={this.state.backgroundPath}
                    changeRequest={this.changeRequest}
                />
                <main className={app.main}>
                    <div className={app.filtersWrapper}>
                        {this.genres &&
                            <Filters
                                onChange={this.handleCheckboxChange}
                                existingGenres={this.genres}
                                choosedGenres={this.state.choosedGenres}
                                allCheckbox={this.state.allGenres}
                            />
                        }
                    </div>
                    <div className={app.wrapper}>
                        <Pagination
                            totalPages={this.state.totalPages}
                            page={this.state.page}
                            changePage={this.changePage}
                        />

                        {this.state.loading && Boolean(this.state.totalPages) && <Skeleton />}

                        {haveMovies && !this.state.loading && (
                            <Movies movies={this.state.movies} />
                        )}

                        {!this.state.loading && !haveMovies && (
                            <div className={app.moviesNotFound}>Ничего не найдено</div>
                        )}

                        <Pagination
                            totalPages={this.state.totalPages}
                            page={this.state.page}
                            changePage={this.changePage}
                        />
                    </div>
                    <div className={app.bgwrapper}>
                        <div
                            className={app.bg}
                            style={{
                                backgroundImage: this.state.backgroundPath.length
                                    ? `url(https://image.tmdb.org/t/p/original/${this.state.backgroundPath}`
                                    : 'none'
                            }}
                        />
                    </div>
                </main>
                <Footer />
            </>
        )
    }
}