import { findRenderedDOMComponentWithClass } from "react-dom/test-utils";

const apiKey = '00479108b898bdd0ebeed080d6bd33fe';

export const api = {
    _path: 'https://api.themoviedb.org/3',

    async search(requestValue, page, adult, signal) {
        let response = null;
        let responseError = null;
        try {
            response = await fetch(
                `${this._path}/search/movie?api_key=${apiKey}&language=en-US&query=${requestValue}&page=${page}&include_adult=${adult}`,
                {
                    signal,
                })
        } catch (error) {
            responseError = new Error(error).message;
        }
        const responseJson = responseError ? null : await response.json();
        return { responseJson, responseError };
    },

    async getGenres() {
        const response = await fetch(
            `${this._path}/genre/movie/list?api_key=${apiKey}&language=en-US`
        )
        return response.json();
    },

    async trends(type = 'day', page, signal) {
        let response = null;
        let responseError = null;
        try {
            response = await fetch(
                `${this._path}/trending/movie/${type}?api_key=${apiKey}&page=${page}`,
                {
                    signal
                }
            )
        } catch (error) {
            responseError = new Error(error).message;
        }
        const responseJson = responseError ? null : await response.json();
        return { responseJson, responseError };
    }
}