export const api = {
    key: '00479108b898bdd0ebeed080d6bd33fe',
    async search(requestValue, page) {
        let result;
        result = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${this.key}&language=en-US&query=${requestValue}&page=${page}&include_adult=false`
        );
        return result.json();
    },
    async trends(type = 'day', page) {
        let result;
        result = await fetch(
            `https://api.themoviedb.org/3/trending/movie/${type}?api_key=${this.key}&page=${page}`
        )
        return result.json();
    }
}