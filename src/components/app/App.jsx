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
            totalPages: 1,
            loading: false,
            choosedGenres: [],
        }
    }

    fetchData = async () => {
        this.setState({ loading: true });

        if (this.abort) {
            this.abort.abort();
        }

        this.abort = new AbortController();
        const fetchedMovies = (this.state.requestValue) ? (
            await api.search(
                this.state.requestValue,
                this.state.page,
                this.state.adult,
                this.abort.signal
            )) : (
            await api.trends(
                'day',
                this.state.page,
                this.abort.signal
            )
        )
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

    checkSelectionOfAllGenres = (allGenres, choosedGenres) => {
        return allGenres.every((elem) => choosedGenres.includes(elem))
    }

    componentDidUpdate(_, prevState) {
        const { page, requestValue, adult } = this.state;
        if (page !== prevState.page
            || (requestValue !== prevState.requestValue)
            || (adult !== prevState.adult && requestValue !== '')) {
            if ((requestValue !== undefined)) {
                this.fetchData();
            }
        }

        if (history.pushState) {
            const paramsObj = new URLSearchParams({
                page: this.state.page,
                adult: this.state.adult
            });
            if (this.state.requestValue !== '') {
                paramsObj.append('request', this.state.requestValue);
            }
            window.history.pushState('', '', `?${paramsObj}`);
        }

    }

    chooseAllGenresOption = () => {
        const allGenresChecked = this.checkSelectionOfAllGenres(this.state.genres, this.state.choosedGenres);
        if (allGenresChecked) {
            this.setState({ choosedGenres: [] })
        } else {
            this.setState({ choosedGenres: this.state.genres })
        }
    }

    handleCheckboxChange = (e) => {
        const value = e.target.value;
        if (value === "adult") {
            this.setState({ adult: !this.state.adult });
        } else if (value === "all") {
            this.chooseAllGenresOption();
        } else {
            if (this.state.choosedGenres.includes(value)) {
                this.setState({ choosedGenres: this.state.choosedGenres.filter((elem) => elem !== value) });
            } else {
                this.setState({ choosedGenres: [...this.state.choosedGenres, e.target.value] });
            }
        }
        this.setState({ page: 1 })
    }

    fetchGenres = async () => {
        const json = await api.getGenres();
        const genres = json.genres;
        return genres.map((elem) => elem.name);
    }

    componentDidMount = async () => {
        this.setState({ loading: true });

        this.setState({
            genres: await this.fetchGenres(),
            choosedGenres: await this.fetchGenres()
        });

        const parsedQueryParams = this.parseQueryParams(this.props.queryParams);

        if (parsedQueryParams.queryAdult === 'true') {
            this.setState({ adult: true });
        } else {
            this.setState({ adult: false });
        }

        if (parsedQueryParams.queryPage) {
            this.setState({ page: Number(parsedQueryParams.queryPage) });
        } else {
            this.setState({ page: 1 });
        }

        if (parsedQueryParams.queryRequestValue !== undefined && parsedQueryParams.queryRequestValue) {
            this.setState({ requestValue: parsedQueryParams.queryRequestValue });
        } else {
            this.setState({ requestValue: '' });
        }

        this.fetchData();

        this.setState({
            backgroundPath: await this.defineBackgroundPath('day'),
            loading: false
        });
    }

    parseQueryParams = (queryParams) => {
        const queryAdult = queryParams.get('adult');
        const queryPage = queryParams.get('page');
        const queryRequestValue = queryParams.get('request');
        return { queryAdult, queryPage, queryRequestValue }
    }

    defineBackgroundPath = async (timeType) => {
        const backgroundFetch = await api.trends(timeType, 1);
        const backgroundPath = backgroundFetch.results[getRandomInteger(0, 20)].backdrop_path;
        return (backgroundPath);
    }

    render() {
        const haveMovies = this.state.movies.length;
        return (
            <>
                <Header
                    backgroundPath={this.state.backgroundPath}
                    changeRequest={this.changeRequest}
                />
                <main className={app.main}>
                    <div className={app.filtersWrapper}>
                        {this.state.genres &&
                            <Filters
                                adult={this.state.adult}
                                onChange={this.handleCheckboxChange}
                                existingGenres={this.state.genres}
                                choosedGenres={this.state.choosedGenres}
                                allChecked={this.checkSelectionOfAllGenres(this.state.genres, this.state.choosedGenres)}
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

                        {Boolean(haveMovies) && !this.state.loading && (
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