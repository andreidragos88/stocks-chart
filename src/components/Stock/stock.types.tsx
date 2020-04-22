export {
    SearchFormValues,
    StockSymbolDay
}

type SearchFormValues = {
    company: string
    startDate: string
    endDate: string
}

type StockSymbolDay = {
    date: Date
    high: number
    low: number
    open: number
    close: number
    volume: number
}
