const apiKey = '00479108b898bdd0ebeed080d6bd33fe';

export const controller = new AbortController();

export const api = {
    _path: 'https://api.themoviedb.org/3',
    async search(requestValue, page, adult, signal) {
        const response = await fetch(
            `${this._path}/search/movie?api_key=${apiKey}&language=en-US&query=${requestValue}&page=${page}&include_adult=${adult}`,
            {
                signal,
            }
        );
        return response.json();
    },
    async trends(type = 'day', page, signal) {
        const response = await fetch(
            `${this._path}/trending/movie/${type}?api_key=${apiKey}&page=${page}`,
            {
                signal
            }
        )
        return response.json();
    }
}