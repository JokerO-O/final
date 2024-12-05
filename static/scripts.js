let display = document.getElementById('calc-display');

function appendNumber(number) {
    display.value += number;
}

function appendOperation(operation) {
    display.value += operation;
}

function clearCalc() {
    display.value = '';
}

function calculate() {
    try {
        display.value = eval(display.value);
    } catch {
        display.value = 'Error';
    }
}
