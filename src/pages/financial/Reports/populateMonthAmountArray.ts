export const newMonthsAmountArray = () => {
    const monthsAmountArray = [];

    for(let m = 1; m <= 13; m++){
        monthsAmountArray[m] = 0;
    }

    return monthsAmountArray;
}