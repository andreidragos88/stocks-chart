import "./style.scss";
import React from "react";
import ReactDOM from "react-dom";
import { store } from './helpers';
import { Provider } from 'react-redux'
import Stock from "./components/Stock/Stock";

ReactDOM.render(
    <Provider store={store}>
        <Stock>
        </Stock>
    </Provider>,
    document.getElementById("app")
)
