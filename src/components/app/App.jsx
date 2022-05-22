import React from 'react';

import main from "./modules/main.module.scss";
import header from "./modules/header.module.scss";

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            page: 1,
            popularBGs: []
        }
    }
    fetchData = async(e) => {
        if (e.target.value) {
            const response = await fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=00479108b898bdd0ebeed080d6bd33fe&language=en-US&query=${e.target.value}&page=1&include_adult=false`
            );
            const json = await response.json();
            this.setState({data: json.results});
        } else {
            const response = await fetch(
                `https://api.themoviedb.org/3/trending/movie/day?api_key=00479108b898bdd0ebeed080d6bd33fe`
            );
            const json = await response.json();
            this.setState({data: json.results});
        }
        
    }
    componentDidMount = async() => {
        const response = await fetch(
            `https://api.themoviedb.org/3/trending/movie/week?api_key=00479108b898bdd0ebeed080d6bd33fe&language=en-US&page=${this.state.page}`
        );
        const json = await response.json();
        this.setState({data: json.results}, () => console.log(this.state.data))
        this.setState({popularBGs: json.results.map(card => card.backdrop_path)})
    }
    render() {
        return(
            <>
                <header className={header.header}>
                    <h1 className={header.heading}>MOVIESEARCH</h1>
                    <input className={header.input} type="text" placeholder='Search' onInput={this.fetchData}></input>
                    <div className={header.header__backgroundContainer}>
                        <div className={header.header__background} style={
                            {backgroundImage: 
                                this.state.popularBGs.length ?
                                `url(https://image.tmdb.org/t/p/original/${this.state.popularBGs[0]})`
                                : "none"
                            }
                        }></div>
                    </div>
                </header>
                <main className={main.main}>
                    <div className={main.cardWrapper}>
                        {this.state.data.length !==0 &&
                        this.state.data.map((result, index) => {
                            return <div key={index} className={main.cardContainer}>
                                <div className={main.card}
                                style={
                                    {backgroundImage:
                                        result.backdrop_path ?
                                        `url(https://image.tmdb.org/t/p/original/${result.backdrop_path})`
                                        : "none"
                                    }
                                }>
                                </div>
                                <div className={main.cardHeading}>
                                    <h2 className={main.cardTitle}>
                                        {result.title && `${result.title} `}
                                        {result.release_date && `(${result.release_date.split("-")[0]})`}
                                    </h2>
                                </div>
                            </div>
                        })}
                    </div>
                    <div className={main.bgContainer}>
                        <div className={main.mainBG} style={
                        {backgroundImage:
                            this.state.popularBGs.length ?
                            `url(https://image.tmdb.org/t/p/original/${this.state.popularBGs[0]})`
                            : "none"
                        }
                        }/>
                        <div className={main.smokeScreen}/>
                    </div>
                </main>
            </>
        )
    }
}