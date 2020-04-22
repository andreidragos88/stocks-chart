import {
    stockConstants
} from '../../constants/action.types'

type StockState = {
	companies: any[]
	chartData: any
	isLoading: Boolean
};

const initialState: StockState = {
	companies: [],
	chartData: {},
	isLoading: false
}

export function stocksReducer(state = initialState, action: any) {
	let newState = {};
    switch (action.type) {
		case stockConstants.SET_COMPANY:
			newState = {
				...state,
				companies: {
					...state.companies,
					[action.companyName]: action.companyData
				}
			};
			break;
		case stockConstants.SET_CHART_DATA:
			newState = {
				...state,
				chartData: action.chartData
			};
			break;
		case stockConstants.STOCK_CHART_LOADING:
			newState = {
				...state,
				isLoading: action.isLoading
			};
			break;
		default:
			newState = { ...state }
	}

	return newState;
}
