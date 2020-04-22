import React, { useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import { SearchFormValues } from "../Stock/stock.types";
import { appendLeadingZeroes } from "../../helpers";

type StockSearchProps = {
    onSearchSubmit(values: any): void
    initialValues: SearchFormValues
}

export default function StockSearch(props: StockSearchProps) {
    const [companies] = useState([{ companyName: "IBM", companyValue: "IBM" }, { companyName: "DAX", companyValue: "DAX" }, {
        companyName: "BABA", companyValue: "BABA"}]);
    const [startDate, setStartDate] = useState(props.initialValues.startDate);
    const [endDate, setEndDate] = useState(props.initialValues.endDate);
    const [company, setCompany] = useState(props.initialValues.company);

    const onFormSubmit = ():void => {
        const values: SearchFormValues = {
            company: company,
            startDate: startDate,
            endDate: endDate
        };
    
        props.onSearchSubmit(values);
    }

    return (
        <form className="form" onSubmit={onFormSubmit} >
            <label>Symbol</label>
            <select
                className="form__select"
                value={company}
                onChange={company => { setCompany(company.currentTarget.value) }}
                name="company">{companies.map((x) => <option key={x.companyValue} value={x.companyValue}>{x.companyName}</option>)}</select>
            <label>Start date</label>
            <Flatpickr
                value={props.initialValues.startDate}
                name="startDate"
                className="form__input"
                onChange={startDate => {
                    setStartDate(startDate[0].getFullYear() + '-' + appendLeadingZeroes(startDate[0].getMonth() + 1) + '-' + appendLeadingZeroes(startDate[0].getDate()));
                }}
            />
            <label>End date</label>
            <Flatpickr
                name="endDate"
                className="form__input"
                value={props.initialValues.endDate}
                onChange={endDate => {
                    setEndDate(endDate[0].getFullYear() + '-' + appendLeadingZeroes(endDate[0].getMonth() + 1) + '-' + appendLeadingZeroes(endDate[0].getDate()));
                }}
            />
            <button className="form__button" type="submit">Search</button>
        </form>
    )
}
