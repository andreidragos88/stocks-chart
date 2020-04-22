import { stockConstants } from '../../constants/action.types'
import { stockService } from '../../services';
import { SearchFormValues, StockSymbolDay } from './stock.types';

export const stockActions = {
    getData
};

function failure(error: string) { return { type: stockConstants.REQUEST_FAILURE, error } }

const prepareChartData = (formValues: { startDate: string, endDate: string }, companyData: { [key: string]: any }): { [key: string]: any } => {
	let newData: Array<StockSymbolDay> = [];
	Object.keys(companyData['Time Series (Daily)']).forEach(function (key) {
		if ((formValues.startDate == '' || (formValues.startDate != '' && key >= formValues.startDate)) &&
			(formValues.endDate == '' || (formValues.endDate != '' && key <= formValues.endDate))) {

			let el = companyData['Time Series (Daily)'][key];
			let companyDay = {} as StockSymbolDay;
			companyDay.date = new Date(key);
			companyDay.high = parseFloat(el['2. high']);
			companyDay.low = parseFloat(el['3. low']);
			companyDay.open = parseFloat(el['1. open']);
			companyDay.close = parseFloat(el['4. close']);
			companyDay.volume = parseInt(typeof el['5. volume'] === "undefined"?el['6. volume']:el['5. volume']);
			newData.push(companyDay);
		}
	})

	newData.sort(function (a: { [key: string]: any }, b: { [key: string]: any }) {
		return a.date > b.date ? 1 : -1;
	})
	
	return {
		type: stockConstants.SET_CHART_DATA,
		chartData: newData
	};
	
};

function loading(isLoading: Boolean) {
	return {
		type: stockConstants.STOCK_CHART_LOADING,
		isLoading
	};
}

function getData(values: SearchFormValues) {
	
	return (dispatch: any, getState: any): any => {
		dispatch(loading(true));
		const companyData = getState().stocks.companies[values.company];

		if (companyData) {
			dispatch(
				prepareChartData(values, companyData)
			);
			dispatch(loading(false));
		} else {
			stockService.getData(values.company)
				.then(
					company => {
						dispatch({ type: stockConstants.SET_COMPANY, companyData: company.data, companyName: values.company });
						dispatch(
							prepareChartData(values, company.data)
						);
						dispatch(loading(false));
					},
					error => dispatch(failure(error.toString()))
				);
		}
    };
}
