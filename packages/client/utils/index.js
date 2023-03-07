import currency from "currency.js";

export const gbp = (value) => currency(value.toString(), { symbol: '£' });
