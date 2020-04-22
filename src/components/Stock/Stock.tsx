import { stockActions } from '../../actions';
import { useDispatch, useSelector } from 'react-redux'
import StockChart from '../StockChart/StockChart';
import StockSearch from '../StockSearch/StockSearch';
import React, { useState, useEffect } from 'react';
import { SearchFormValues } from './stock.types';

type Props = {
    children: React.ReactNode
};

function Stock(props: Props) {
    const chartData = useSelector((state: any) => state.stocks.chartData);
    const isLoading = useSelector((state: any) => state.stocks.isLoading);
    const dispatch = useDispatch();
    
    const initialSearchValues: SearchFormValues = {
        company: 'DAX',
        startDate: '2018-01-01',
        endDate: '2019-02-01'
    };
    
    useEffect(() => {
        dispatch(stockActions.getData(initialSearchValues));
    }, []);

    function onSearchSubmit(values: SearchFormValues): void {
        event.preventDefault();
        dispatch(stockActions.getData(values));
    }
    
    return (
        <div>
            <h1>Stock Market</h1>
            <StockSearch
                onSearchSubmit={onSearchSubmit}
                initialValues={initialSearchValues} />
            <StockChart
                chartData={chartData}
                isLoading={isLoading}
            />
        </div>
    )
}

export default Stock;
