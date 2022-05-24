import React from 'react';

import main from "./modules/main.module.scss";
import cn from 'classnames';
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
            totalPages: 1,
            paginator: [1, 2, 3, 4, 5]
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
            this.setState({paginator: this.state.paginator.map(elem => elem + 1)}, () => {
                if (!this.state.paginator.includes(this.state.page)) {
                    this.setState({page: this.state.paginator[0]})
                }
            })
        } else if (e.target.value === "back") {
            this.setState({paginator: this.state.paginator.map(elem => elem - 1)}, () => {
                if (!this.state.paginator.includes(this.state.page)) {
                    this.setState({page: this.state.paginator[this.state.paginator.length - 1]})
                }
            })
        } else {
            this.setState({page: Number(e.target.value)})
        }
    }
    changeRequest = (e) => {
        this.setState({page: 1})
        this.setState({requestValue: e.target.value});
        this.setState({paginator: [1, 2, 3, 4, 5]})
    }
    componentDidUpdate(prevProps, prevState) {
        const { page, requestValue } = this.state;
        if (page !== prevState.page|| requestValue !== prevState.requestValue) {
            this.fetchData();
        }
    }
    componentDidMount = async() => {
        const response = await fetch(
            `https://api.themoviedb.org/3/trending/movie/week?api_key=00479108b898bdd0ebeed080d6bd33fe&language=en-US&page=${this.state.paginator[0]}`
        );
        const json = await response.json();
        this.setState({data: json.results});
        let bgNumber = Math.floor(Math.random() * 20);
        this.setState({popularBGs: json.results.map(card => card.backdrop_path)}, () => {
            this.setState({currentBG: this.state.popularBGs[bgNumber]})
        });
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
                        {<button type='button' disabled={this.state.paginator[0]===1} className={cn(paginator.button, this.state.paginator[0]===1 ? paginator.disabled : '')} value={"back"} onClick={this.changePage}>{'<'}</button>}
                        <button type='button' className={cn(paginator.button, this.state.page === this.state.paginator[0]?paginator.current:'')} onClick={this.changePage} value={this.state.paginator[0]}>{this.state.paginator[0]}</button>
                        <button type='button' className={cn(paginator.button, this.state.page === this.state.paginator[1]?paginator.current:'')} onClick={this.changePage} value={this.state.paginator[1]}>{this.state.paginator[1]}</button>
                        <button type='button' className={cn(paginator.button, this.state.page === this.state.paginator[2]?paginator.current:'')} onClick={this.changePage} value={this.state.paginator[2]}>{this.state.paginator[2]}</button>
                        <button type='button' className={cn(paginator.button, this.state.page === this.state.paginator[3]?paginator.current:'')} onClick={this.changePage} value={this.state.paginator[3]}>{this.state.paginator[3]}</button>
                        <button type='button' className={cn(paginator.button, this.state.page === this.state.paginator[4]?paginator.current:'')} onClick={this.changePage} value={this.state.paginator[4]}>{this.state.paginator[4]}</button>
                        {<button type='button' disabled={!(this.state.totalPages > this.state.paginator[0])} className={cn(paginator.button, !(this.state.totalPages > this.state.paginator[0]) ? paginator.disabled : '')} value={"forward"} onClick={this.changePage}>{'>'}</button>}
                    </div>
                    <div className={main.cardWrapper}>
                        {this.state.data.length !==0 &&
                        this.state.data.map((result, index) => {
                            return (<div key={index} className={main.cardContainer}>
                                        <div className={main.card}>
                                            {result.poster_path ? <img className={main.cardPoster} src={
                                            `https://image.tmdb.org/t/p/w780/${result.poster_path}`}/> : 
                                            <div className={main.posterNotFound}>Not Found</div>}
                                        </div>
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
                        {<button type='button' disabled={this.state.paginator[0]===1} className={cn(paginator.button, this.state.paginator[0]===1 ? paginator.disabled : '')} value={"back"} onClick={this.changePage}>{'<'}</button>}
                        <button type='button' className={cn(paginator.button, this.state.page === this.state.paginator[0]?paginator.current:'')} onClick={this.changePage} value={this.state.paginator[0]}>{this.state.paginator[0]}</button>
                        <button type='button' className={cn(paginator.button, this.state.page === this.state.paginator[1]?paginator.current:'')} onClick={this.changePage} value={this.state.paginator[1]}>{this.state.paginator[1]}</button>
                        <button type='button' className={cn(paginator.button, this.state.page === this.state.paginator[2]?paginator.current:'')} onClick={this.changePage} value={this.state.paginator[2]}>{this.state.paginator[2]}</button>
                        <button type='button' className={cn(paginator.button, this.state.page === this.state.paginator[3]?paginator.current:'')} onClick={this.changePage} value={this.state.paginator[3]}>{this.state.paginator[3]}</button>
                        <button type='button' className={cn(paginator.button, this.state.page === this.state.paginator[4]?paginator.current:'')} onClick={this.changePage} value={this.state.paginator[4]}>{this.state.paginator[4]}</button>
                        {<button type='button' disabled={!(this.state.totalPages > this.state.paginator[0])} className={cn(paginator.button, !(this.state.totalPages > this.state.paginator[0]) ? paginator.disabled : '')} value={"forward"} onClick={this.changePage}>{'>'}</button>}
                    </div>
                </main>
            </>
        )
    }
}