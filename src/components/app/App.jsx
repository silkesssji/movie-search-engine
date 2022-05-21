import React from 'react';

import styles from "./app.module.scss";

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            page: 4,
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
            console.log(this.state.data)
        } else {
            const response = await fetch(
                `https://api.themoviedb.org/3/trending/movie/day?api_key=00479108b898bdd0ebeed080d6bd33fe`
            );
            const json = await response.json();
            this.setState({data: json.results});
            console.log(this.state.data)
        }
        
    }
    componentDidMount = async() => {
        const response = await fetch(
            `https://api.themoviedb.org/3/trending/movie/week?api_key=00479108b898bdd0ebeed080d6bd33fe&language=en-US&page=${this.state.page}`
        );
        const json = await response.json();
        this.setState({page: this.state.page + 1});
        this.setState({data: json.results}, () => console.log(this.state.data))
        this.setState({popularBGs: json.results.map(card => card.backdrop_path)})
    }
    render() {
        return(
            <>
                <div className={styles.header}>
                    <h1 className={styles.heading}>MOVIESEARCH</h1>
                    <input className={styles.input} type="text" placeholder='Search' onInput={this.fetchData}></input>
                    <div className={styles.header__backgroundContainer}>
                        <div className={styles.header__background} style={
                            {backgroundImage: 
                                this.state.popularBGs.length ?
                                `url(https://image.tmdb.org/t/p/original/${this.state.popularBGs[0]})`
                                : "none"
                            }
                        }></div>
                    </div>
                </div>
                
                <div className={styles.main}>
                    <div className={styles.smokeScreen}/>
                    <div className={styles.mainBG} style={
                    {backgroundImage: 
                        this.state.popularBGs.length ?
                        `url(https://image.tmdb.org/t/p/original/${this.state.popularBGs[0]})`
                        : "none"
                    }
                    }/>
                    {this.state.data.length !==0 &&
                    this.state.data.map((result, index) => {
                        return <div key={index} className={styles.cardContainer}>
                            <div className={styles.card}
                            style={
                                {backgroundImage:
                                    result.backdrop_path ?
                                    `url(https://image.tmdb.org/t/p/original/${result.backdrop_path})`
                                    : "none"
                                }
                            }>
                            </div>
                            <div className={styles.cardHeading}>
                                <h2 className={styles.cardTitle}>
                                    {result.title && `${result.title} `}
                                    {result.release_date && `(${result.release_date.split("-")[0]})`}
                                </h2>
                            </div>
                        </div>
                    })}
                </div>
            </>
        )
    }
}