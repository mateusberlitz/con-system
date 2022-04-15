export function newMonthsAmountArraySimple() {
    const monthsAmountArray = [];

    for (let m = 1; m <= 12; m++) {
        monthsAmountArray[m] = 0;
    }

    return monthsAmountArray;
}