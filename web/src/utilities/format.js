export function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export const currencyFormatter = new Intl.NumberFormat('en-US', {
    // These options are needed to round to whole numbers if that's what you want.
    // minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    notation: 'compact',
    maximumFractionDigits: 2, // (causes 2500.99 to be printed as $2,501)
});

export const formatNumber = (value) => (
    Number.isNaN(parseFloat(value)) ? value : currencyFormatter.format(value)
);

export const displayPct = (value, decimals = 2) => `${parseFloat((value * 100).toFixed(decimals))} %`;
