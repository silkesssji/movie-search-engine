import React from 'react';

import styles from "./app.module.scss";
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
            mounting: true,
            backgroundPath: '',
            totalPages: 1,
            error: false,
            loading: true,
            choosedGenres: [],
            requestValue: '',
            adult: false,
        }
    }

    fetchMovies = async () => {
        this.setState({ loading: true });

        if (this.abort) {
            this.abort.abort();
        }

        this.abort = new AbortController();
        try {
            const fetchedMovies = this.state.requestValue
                ? await api.search(
                    this.state.requestValue,
                    this.state.page,
                    this.state.adult,
                    this.abort.signal
                )
                : await api.trends(
                    'day',
                    this.state.page,
                    this.abort.signal
                );
            this.setState({
                totalPages: fetchedMovies.total_pages,
                movies: fetchedMovies.results,
                loading: false,
                error: false
            });
        } catch (e) {
            this.setState({ error: e.message });
        }

        this.abort = null;
    }

    handlePageChange = (page) => {
        this.setState({ page });
    }

    handleRequestChange = debounce((e) => {
        if (e.target.value.replace(/\s/g, '')) {
            this.setState({
                page: 1,
                requestValue: e.target.value,
            });
        } else {
            this.setState({ requestValue: '' });
        }
    }, 300)

    areAllGenresChecked = (allGenres, choosedGenres) => {
        return allGenres.every((genre) => choosedGenres.includes(genre))
    }

    updateHistoryQueryParams = ({ page, adult, requestValue }) => {
        if (history.pushState) {
            const paramsObj = new URLSearchParams({
                page,
                adult,
            });
            if (this.state.requestValue !== '') {
                paramsObj.append('request', requestValue);
            }
            window.history.pushState('', '', `?${paramsObj}`);
        }
    }

    componentDidUpdate(_, prevState) {
        const { page, requestValue, adult } = this.state;
        if ((page !== prevState.page
            || requestValue !== prevState.requestValue
            || adult !== prevState.adult) && this.state.mounting === false
        ) {
            this.updateHistoryQueryParams({ page, requestValue, adult })
            if ((requestValue !== undefined)) {
                this.fetchMovies();
            }
        }
    }

    chooseAllGenresOption = () => {
        const allGenresChecked = this.areAllGenresChecked(this.state.genres, this.state.choosedGenres);
        if (allGenresChecked) {
            this.setState({ choosedGenres: [] })
        } else {
            this.setState({ choosedGenres: this.state.genres })
        }
    }

    handleCheckboxChange = (e) => {
        const checkboxValue = e.target.value;
        if (checkboxValue === "adult") {
            this.setState({ adult: !this.state.adult });
        } else if (checkboxValue === "all") {
            this.chooseAllGenresOption();
        } else {
            if (this.state.choosedGenres.includes(checkboxValue)) {
                this.setState({ choosedGenres: this.state.choosedGenres.filter((genre) => genre !== checkboxValue) });
            } else {
                this.setState({ choosedGenres: [...this.state.choosedGenres, checkboxValue] });
            }
        }
        this.setState({ page: 1 })
    }

    fetchGenreNames = async () => {
        const json = await api.getGenres();
        const genres = json.genres;
        return genres.map((genre) => genre.name);
    }

    componentDidMount = async () => {
        this.setState({
            genres: await this.fetchGenreNames(),
            choosedGenres: await this.fetchGenreNames()
        });

        const { queryAdult, queryPage, queryRequestValue } = this.getQueryParams(this.props.initialQueryParams);

        if (queryAdult === 'true') {
            this.setState({ adult: true });
        }
        if (queryPage) {
            this.setState({ page: Number(queryPage) });
        }
        if (queryRequestValue) {
            this.setState({ requestValue: queryRequestValue });
        }
        this.setState({ backgroundPath: await this.fetchRandomBackgroundUrl('day') })
        await this.fetchMovies();
        this.setState({
            mounting: false,
            loading: false
        });
    }

    getQueryParams = (queryParams) => {
        const queryAdult = queryParams.get('adult');
        const queryPage = queryParams.get('page');
        const queryRequestValue = queryParams.get('request');
        return { queryAdult, queryPage, queryRequestValue }
    }

    fetchRandomBackgroundUrl = async (timeType) => {
        const backgroundFetch = await api.trends(timeType, 1);
        // debugger;
        const backgroundPath = backgroundFetch.results[getRandomInteger(0, 19)].backdrop_path;
        return backgroundPath;
    }

    render() {
        const haveMovies = this.state.movies.length;
        return (
            <>
                <Header
                    backgroundPath={this.state.backgroundPath}
                    changeRequest={this.handleRequestChange}
                />
                <main className={styles.main}>
                    <div className={styles.filtersWrapper}>
                        {this.state.genres &&
                            <Filters
                                adult={this.state.adult}
                                onChange={this.handleCheckboxChange}
                                existingGenres={this.state.genres}
                                choosedGenres={this.state.choosedGenres}
                                allChecked={this.areAllGenresChecked(this.state.genres, this.state.choosedGenres)}
                            />
                        }
                    </div>
                    <div className={styles.wrapper}>
                        <Pagination
                            totalPages={this.state.totalPages}
                            page={this.state.page}
                            changePage={this.handlePageChange}
                        />

                        {this.state.loading && !this.state.error && <Skeleton />}

                        {Boolean(haveMovies) && !this.state.loading && !this.state.error && (
                            <Movies movies={this.state.movies} />
                        )}

                        {this.state.error &&
                            <div className={styles.errorMessage}>
                                {this.state.error}
                                <button className={styles.refreshButton} onClick={this.fetchMovies}>
                                    Retry
                                </button>
                            </div>}

                        {this.state.loading === false && !haveMovies && !this.state.error && (
                            <div className={styles.moviesNotFound}>Ничего не найдено</div>
                        )}

                        <Pagination
                            totalPages={this.state.totalPages}
                            page={this.state.page}
                            changePage={this.handlePageChange}
                        />
                    </div>
                    <div className={styles.bgwrapper}>
                        <div
                            className={styles.bg}
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
