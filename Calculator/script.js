const display = document.querySelector("#display");
const buttons = document.querySelectorAll(".btn");

let firstnumber;
let operator;
let secondnumber;

buttons.forEach(function (val) {
    val.addEventListener("click", function (d) {
        d.preventDefault();

        let inp = d.target.textContent;
        let value = d.target.dataset.value;

        // Decimal point
        if (value === ".") {
            if (!display.value.includes(".")) {
                // If display is empty, start with 0.
                if (display.value === "") {
                    display.value = "0.";
                } else {
                    display.value = display.value + inp;
                }
            }
        }

        // Normal numbers
        else if (val.classList.contains("number")) {
            display.value = display.value + inp;
        }

        // AC
        if (value === "AC") {
            display.value = "";

            firstnumber = undefined;
            operator = undefined;
            secondnumber = undefined;
        }

        // DEL
        if (value === "DEL") {
            display.value = display.value.slice(0, -1);
        }

        // Operator
        if (val.classList.contains("operator")) {
            // Don't allow operator if display is empty
            if (display.value === "") {
                return;
            }

            firstnumber = Number(display.value);
            operator = value;

            display.value = "";
        }

        // Equal
        if (val.classList.contains("equal")) {
            // Don't calculate without both numbers and an operator
            if (
                firstnumber === undefined ||
                operator === undefined ||
                display.value === ""
            ) {
                return;
            }

            secondnumber = Number(display.value);

            let result;

            if (operator === "+") {
                result = firstnumber + secondnumber;
            } else if (operator === "-") {
                result = firstnumber - secondnumber;
            } else if (operator === "*") {
                result = firstnumber * secondnumber;
            } else if (operator === "/") {
                if (secondnumber === 0) {
                    display.value = "Error";

                    firstnumber = undefined;
                    operator = undefined;
                    secondnumber = undefined;

                    return;
                }

                result = firstnumber / secondnumber;
            }

            display.value = result;

            // Result becomes the first number
            // for the next calculation
            firstnumber = result;

            operator = undefined;
            secondnumber = undefined;
        }
    });
});