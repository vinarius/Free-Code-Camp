// Design a cash register drawer function checkCashRegister() that accepts purchase price as the first argument (price), payment as the second argument (cash), and cash-in-drawer (cid) as the third argument.
// cid is a 2D array listing available currency.
// Return the string "Insufficient Funds" if cash-in-drawer is less than the change due. Return the string "Closed" if cash-in-drawer is equal to the change due.
// Otherwise, return change in coin and bills, sorted in highest to lowest order.

'use strict';

//combines all cash in drawer and returns a string total
function addCashInDrawer(cid) {
    let total = 0;
    for (let i = 0; i < cid.length; i++) {
        total += cid[i][1];
    }
    return total.toFixed(2);
}

//verify customer can afford the price
function calculateChange(price, cash) {
    if (cash > price) {
        return (cash.toFixed(2) - price.toFixed(2)).toFixed(2);
    } else {
        return false;
    }
}

//distributes exact change if exact change is available
//if not available, returns "Insufficient Funds"
function distributeExactChange(change, cid) {

    var changeAnswer = [
        ["PENNY", 0],
        ["NICKEL", 0],
        ["DIME", 0],
        ["QUARTER", 0],
        ["ONE", 0],
        ["FIVE", 0],
        ["TEN", 0],
        ["TWENTY", 0],
        ["ONE HUNDRED", 0]
    ];

    var changeCounter = Number(change.toFixed(2));
    var changeStillLeft = true;

    while (changeStillLeft) {
        changeCounter = Number(changeCounter.toFixed(2));

        //based on how much change is needed, distributeExactChange() will give change from largest increments first, then break
        //and loop through again until all change has been distributed
        //returns 2D array with what change must be given - this is the answer to the algorithm
        if (changeCounter >= 100.00 && cid[8][1] >= 100.00) {
            if (cid[8][1] >= 100.00) {
                cid[8][1] -= 100.00;
                changeAnswer[8][1] = changeAnswer[8][1] + 100.00;
                changeCounter = changeCounter - 100.00;
            }
        } else if (changeCounter >= 20.00 && cid[7][1] >= 20.00) {
            if (cid[7][1] >= 20.00) {
                cid[7][1] -= 20.00;
                changeAnswer[7][1] += 20.00;
                changeCounter = changeCounter - 20.00;
            }
        } else if (changeCounter >= 10.00 && cid[6][1] >= 10.00) {
            if (cid[6][1] >= 10.00) {
                cid[6][1] -= 10.00;
                changeAnswer[6][1] += 10.00;
                changeCounter = changeCounter - 10.00;
            }
        } else if (changeCounter >= 5.00 && cid[5][1] >= 5.00) {
            if (cid[5][1] >= 5.00) {
                cid[5][1] -= 5.00;
                changeAnswer[5][1] += 5.00;
                changeCounter = changeCounter - 5.00;
            }
        } else if (changeCounter >= 1.00 && cid[4][1] >= 1.00) {
            if (cid[4][1] >= 1.00) {
                cid[4][1] -= 1.00;
                changeAnswer[4][1] += 1.00;
                changeCounter = changeCounter - 1.00;
            }
        } else if (changeCounter >= 0.25 && cid[3][1] >= 0.25) {
            if (cid[3][1] >= 0.25) {
                cid[3][1] -= 0.25;
                changeAnswer[3][1] += 0.25;
                changeCounter = changeCounter - 0.25;
            }
        } else if (changeCounter >= 0.10 && cid[2][1] >= 0.10) {
            if (cid[2][1] >= 0.10) {
                cid[2][1] -= 0.10;
                changeAnswer[2][1] += 0.10;
                changeCounter = changeCounter - 0.10;
            }
        } else if (changeCounter >= 0.05 && cid[1][1] >= 0.05) {
            if (cid[1][1] >= 0.05) {
                cid[1][1] -= 0.05;
                changeAnswer[1][1] += 0.05;
                changeCounter = changeCounter - 0.05;
            }
        } else if (changeCounter >= 0.01 && cid[0][1] >= 0.01) {
            if (cid[0][1] >= 0.01) {
                cid[0][1] -= 0.01;
                changeAnswer[0][1] += 0.01;
                changeCounter = changeCounter - 0.01;
            }
        } else if (changeCounter === 0) {
            changeStillLeft = false;
            break;
        } else {
            changeStillLeft = false;
            return "Insufficient Funds";
        }
    }

    var empty = [];

    for (let i = 0; i < changeAnswer.length; i++) {
        if (changeAnswer[i][1] !== 0) {
            empty.push(changeAnswer[i]);
        }
    }

    changeAnswer = empty;

    for (let i = 0; i < changeAnswer.length; i++) {
        if (changeAnswer[i][1] !== 0) {
            changeAnswer[i][1] = changeAnswer[i][1].toFixed(2);
            changeAnswer[i][1] = Number(changeAnswer[i][1]);
        }
    }

    return changeAnswer.reverse();
}

function distributeChange(change, totalCashInDrawer, cid) {

    // console.log('the problem is occurring in the distributeChange function.');
    // console.log("I can't figure out why the js interprets change to be a larger amount");
    // console.log("than the totalCashInDrawer for the given arguments.");
    // console.log();
    // console.log('totalCashInDrawer < change =', totalCashInDrawer < change);

    change = Number(change);
    totalCashInDrawer = Number(totalCashInDrawer);

    if (change < totalCashInDrawer) {
        return distributeExactChange(change, cid);
    } else if (change == totalCashInDrawer) {
        return "Closed";
    } else {
        return "Insufficient Funds";
    }
}

function checkCashRegister(price, cash, cid) {
    var totalCashInDrawer = addCashInDrawer(cid);
    var change = calculateChange(price, cash);
    if (!change) {
        return "Insufficient Payment Funds";
    }
    console.log('cash =', cash);
    console.log('price =', price);
    console.log('change =', change);
    console.log('totalCashInDrawer = ', totalCashInDrawer);
    console.log();

    return distributeChange(change, totalCashInDrawer, cid);
}

checkCashRegister(3.26, 100.00, [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.10],
    ["QUARTER", 4.25],
    ["ONE", 90.00],
    ["FIVE", 55.00],
    ["TEN", 20.00],
    ["TWENTY", 60.00],
    ["ONE HUNDRED", 100.00]
]);

// Example cash-in-drawer array:
// [
//  ["PENNY", 1.01], 0
//  ["NICKEL", 2.05], 1
//  ["DIME", 3.10], 2
//  ["QUARTER", 4.25], 3
//  ["ONE", 90.00], 4
//  ["FIVE", 55.00], 5
//  ["TEN", 20.00], 6
//  ["TWENTY", 60.00], 7
//  ["ONE HUNDRED", 100.00] 8
// ]