import React from 'react';

import main from "./modules/main.module.scss";
import header from "./modules/header.module.scss";
import paginator from "./modules/paginator.module.scss"

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            page: 1,
            popularBGs: [],
            currentBG: '',
            requestValue: '',
            totalPages: 1
        }
    }
    interval = (func, time) => {
        return setInterval(func, time);
    }
    fetchData = async() => {
        if (this.state.requestValue !== '') {
            const response = await fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=00479108b898bdd0ebeed080d6bd33fe&language=en-US&query=${this.state.requestValue}&page=${this.state.page}&include_adult=false`
            );
            const json = await response.json();
            this.setState({totalPages: json.total_pages});
            this.setState({data: json.results});
        } else {
            const response = await fetch(
                `https://api.themoviedb.org/3/trending/movie/day?api_key=00479108b898bdd0ebeed080d6bd33fe&page=${this.state.page}`
            );
            const json = await response.json();
            this.setState({totalPages: json.total_pages});
            this.setState({data: json.results});
        }
        
    }
    changePage = (e) => {
        if (e.target.value === "forward") {
            this.setState({page: this.state.page + 1}, () => this.fetchData());
        } else if (e.target.value === "back") {
            this.setState({page: this.state.page - 1}, () => this.fetchData());
        } else {
            this.setState({page: Number(e.target.value)}, () => this.fetchData());
        }
    }
    changeRequest = (e) => {
        this.setState({page: 1})
        this.setState({requestValue: e.target.value}, () => this.fetchData());
    }
    componentDidMount = async() => {
        const response = await fetch(
            `https://api.themoviedb.org/3/trending/movie/week?api_key=00479108b898bdd0ebeed080d6bd33fe&language=en-US&page=${this.state.page}`
        );
        const json = await response.json();
        this.setState({data: json.results});
        let bgNumber = Math.floor(Math.random() * 20);
        this.setState({popularBGs: json.results.map(card => card.backdrop_path)}, () => {
            this.setState({ currentBG: this.state.popularBGs[bgNumber]});
            setInterval(() => {
            const newRandom = (item) => {
                let result = 0;
                do {
                    result = Math.floor(Math.random() * 10);
                } while (item === result);
                return result;
            }
            bgNumber = newRandom(bgNumber);
            this.setState({ currentBG: this.state.popularBGs[bgNumber]});
        }, 30000)})
        this.setState({totalPages: json.total_pages});
    }
    render() {
        return(
            <>
                <header className={header.header} style={
                            {backgroundImage: 
                                this.state.popularBGs.length ?
                                `url(https://image.tmdb.org/t/p/original/${this.state.currentBG})`
                                : "none",
                                transition: 'background-image 1s ease',
                            }
                        }>
                    <h1 className={header.heading}>MOVIESEARCH</h1>
                    <input className={header.input} type="text" placeholder='Search' onInput={this.changeRequest}></input>
                </header>
                <main className={main.main}>
                    <div className={paginator.paginator}>
                        {this.state.page!==1 && <button type='button' className={paginator.button} value={"back"} onClick={this.changePage}>{'<'}</button>}
                        <div className={paginator.current}>{this.state.page}</div>
                        {(this.state.totalPages > this.state.page) && <button type='button' className={paginator.button} value={"forward"} onClick={this.changePage}>{'>'}</button>}
                    </div>
                    <div className={main.cardWrapper}>
                        {this.state.data.length !==0 &&
                        this.state.data.map((result, index) => {
                            return (<div key={index} className={main.cardContainer}>
                                        {result.poster_path ? <img className={main.card} src={
                                        `https://image.tmdb.org/t/p/w780/${result.poster_path}`}/> : 
                                        <div className={main.posterNotFound}>Not Found</div>}
                                        <div className={main.cardHeading}>
                                            <h2 className={main.cardTitle}>
                                                {result.title && `${result.title} `}
                                                {result.release_date && `(${result.release_date.split("-")[0]})`}
                                            </h2>
                                        </div>
                                    </div>)
                                }
                        )}
                    </div>
                    <div className={main.bgwrapper}>
                        <div className={main.smoke}/>
                        <div className={main.bg} style={
                        {backgroundImage:
                            this.state.popularBGs.length ?
                            `url(https://image.tmdb.org/t/p/w300/${this.state.currentBG})`
                            : "none",
                            transition: 'background-image 0.5s ease',
                        }
                        }/>
                    </div>
                    <div className={paginator.paginator}>
                        {this.state.page!==1 && <button type='button' className={paginator.button} value={"back"} onClick={this.changePage}>{'<'}</button>}
                        <div className={paginator.current}>{this.state.page}</div>
                        {(this.state.totalPages > this.state.page) && <button type='button' className={paginator.button} value={"forward"} onClick={this.changePage}>{'>'}</button>}
                    </div>
                </main>
            </>
        )
    }
}