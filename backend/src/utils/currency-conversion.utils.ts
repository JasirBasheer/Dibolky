export const CountryToCurrency: Record<string, string> = {
    IN: "INR",
    US: "USD",
};


export const convertUSDtoINR = (usdPrice: number): number => {
    const exchangeRate = 87.11;
    return Math.round(usdPrice * exchangeRate);
}

export const convertUSDtoAED = (usdPrice: number): number => {
    const exchangeRate = 3.6725;
    return Math.round(usdPrice * exchangeRate);
}


export const getPriceConversionFunc = (region: string) => {
    switch (region) {
        case 'INR':
            return convertUSDtoINR;
        case 'AED':
            return convertUSDtoAED;
        default:
            return (price: number) => price;
    }
}