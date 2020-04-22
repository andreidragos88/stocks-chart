import { combineReducers } from 'redux';

import { stocksReducer } from './components/Stock/stock.reducer';

export const rootReducer = combineReducers({ stocks: stocksReducer });

export type RootState = ReturnType<typeof rootReducer>