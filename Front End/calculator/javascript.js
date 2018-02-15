$(document).ready(function () {

    //where the inputs will go
    var displayContainer = [""];

    //updated total
    var total;

    var operators = ["+", "-", "*", "/"];
    var decimal = ["."];

    //for validation purposes
    var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    //update the total and display it on the calculator
    function update() {
        total = displayContainer.join('');
        $("#historyField").html(total);
    }
    //get the value and update the total string
    function addToDisplayContainer(input) {
        if (decimal.includes(displayContainer[displayContainer.length - 1]) === true && input === ".") {
            console.log("duplicate decimal error");
        } else if (displayContainer.length === 1 && operators.includes(input) === false) {
            displayContainer.push(input);
        } else if (operators.includes(displayContainer[displayContainer.length - 1]) === false) {
            displayContainer.push(input);
        } else if (numbers.includes(Number(input))) {
            displayContainer.push(input);
        }
        update();
    }

    function completeCalculation() {
        total = displayContainer.join('');
        $("#historyField").html(eval(total));
    }

    $(".button").click(function () {
        if (this.id === "ACButton") {
            displayContainer = [""];
            update();
        } else if (this.id === "CEButton") {
            if (displayContainer[displayContainer.length - 1] === "") {
                update();
            } else {
                displayContainer.pop();
                update();
            }
        } else if (this.id === "equalsButton") {
            completeCalculation();
        } else {
            if (displayContainer[displayContainer.length - 1].indexOf("+", "-", "*", "/", ".") === -1) {
                addToDisplayContainer(this.id);
            } else {
                addToDisplayContainer(this.id);
            }
        }
    });

});