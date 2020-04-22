import React, { useEffect } from "react";
import { StockSymbolDay } from "../Stock/stock.types";
import { isEmpty } from "../../helpers";
import { initialiseChart } from "./chart-renderer";
import "./style.scss";

type StockChartProps = {
    chartData: Array<StockSymbolDay>
    isLoading: Boolean
}

export function StockChart(props: StockChartProps) {
    const { chartData, isLoading } = props;

    useEffect(() => {
        if (!isEmpty(chartData)) {
            initialiseChart(chartData);
        }
    }, [chartData])

    return (
        <div>
            <h1>Stock Chart {isLoading && '- Loading...'}</h1>
            <div id="chart"></div>
        </div>
    )
}

export default StockChart
