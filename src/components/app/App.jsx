import React from 'react';

import styles from "./app.module.scss";

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            page: 1,
            popularBGs: []
        }
    }
    handlingSearch = (e) => {
        this.fetchData();
    }
    fetchData = async() => {
        const response = await fetch(
            `https://api.themoviedb.org/3/trending/movie/week?api_key=00479108b898bdd0ebeed080d6bd33fe&language=en-US&page=${this.state.page}`
        );
        const json = await response.json();
        this.setState({page: this.state.page + 1});
        this.setState({data: json.results});
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
                    <input className={styles.input} type="search" placeholder='Search' onChange={this.handlingSearch}></input>
                    <div className={styles.header__backgroundContainer}>
                        <div className={styles.smokeScreen}/>
                        <div className={styles.header__background} style={
                            {backgroundImage: 
                                this.state.popularBGs.length ?
                                `url(https://image.tmdb.org/t/p/original/${this.state.popularBGs[0]})`
                                : "none"
                            }
                        }></div>
                    </div>
                </div>
                {/* <div className={styles.main}>
                    {this.state.data.length !==0 &&
                    this.state.data.map((result, index) => {
                        return <div key={index} className="card">
                            {result.title}
                        </div>
                    })}
                    <button type='button' onClick={this.fetchData}>Загрузить</button>
                </div> */}
            </>
        )
    }
}