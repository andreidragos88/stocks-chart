import axios from 'axios';
const API_KEY = "VP2DLYQW8HE1KB16";

function getData(company: string): Promise<any> {
    return axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${company}&outputsize=full&apikey=${API_KEY}`)
}

export const stockService = {
    getData
};
