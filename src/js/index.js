import '../css/style.css';

const display = document.querySelector('.display');
const buttons = document.querySelectorAll('.btn');
const themeSwitch = document.querySelector('input[type="checkbox"]');

let firstOperand = null;
let currentOperator = null;
let resetDisplay = false;
let calculation = '';

function updateDisplay(value) {
  display.textContent = value;
  display.scrollLeft = display.scrollWidth;
}

function handleNumber(number) {
  if (resetDisplay) {
    calculation = number;
    resetDisplay = false;
  } else if (calculation === '0' && number !== ',') {
    calculation = number;
  } else {
    calculation += number;
  }
  updateDisplay(calculation);
}

function handleOperator(operator) {
  if (currentOperator) {
    handleEquals();
  }
  firstOperand = parseFloat(calculation.replace(',', '.'));
  currentOperator = operator;
  resetDisplay = true;
  calculation += ' ' + operator + ' ';
  updateDisplay(calculation);
}

function handleEquals() {
  if (currentOperator) {
    const parts = calculation.split(' ');
    const secondOperand = parseFloat(parts[parts.length - 1].replace(',', '.'));
    const result = operate(firstOperand, secondOperand, currentOperator);
    updateDisplay(String(result).replace('.', ','));
    firstOperand = result;
    currentOperator = null;
    calculation = String(result);
    resetDisplay = true;
  }
}

function handleDecimal() {
  if (resetDisplay) {
    calculation = '0,';
    resetDisplay = false;
  } else if (!calculation.includes(',')) {
    calculation += ',';
  }
  updateDisplay(calculation);
}

function handleAllClear() {
  firstOperand = null;
  currentOperator = null;
  resetDisplay = false;
  calculation = '';
  updateDisplay('0');
}

function handleSignChange() {
  const value = parseFloat(display.textContent.replace(',', '.'));
  const newValue = -value;
  updateDisplay(String(newValue).replace('.', ','));
  calculation = String(newValue);
}

function handlePercent() {
  handleOperator('%');
}

function operate(a, b, operator) {
  switch (operator) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return a / b;
    case '%':
      return a % b;
    default:
      return null;
  }
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent;
    const isNumber = !isNaN(parseFloat(value)) || value === '0';
    const isOperator = ['+', '-', '*', '/'].includes(value);

    if (isNumber) {
      handleNumber(value);
    } else if (isOperator) {
      handleOperator(value);
    } else if (value === '=') {
      handleEquals();
    } else if (value === ',') {
      handleDecimal();
    } else if (value === 'AC') {
      handleAllClear();
    } else if (value === '+/-') {
      handleSignChange();
    } else if (value === '%') {
      handlePercent();
    }
  });
});

themeSwitch.addEventListener('change', () => {
  document.body.classList.toggle('light-theme');
});