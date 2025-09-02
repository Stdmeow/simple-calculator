import '../css/style.css';

const display = document.querySelector('.display');
const buttons = document.querySelectorAll('.btn');
const themeSwitch = document.querySelector('input[type="checkbox"]');

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
  if (calculation === '') return;
  
  const lastChar = calculation.slice(-1);
  if (['+', '-', '*', '/', '%'].includes(lastChar)) {
    calculation = calculation.slice(0, -1) + operator;
  } else {
    calculation += ' ' + operator + ' ';
  }
  
  updateDisplay(calculation);
  resetDisplay = false;
}

function handleEquals() {
  const result = calculateExpression(calculation);
  if (result === null || isNaN(result)) {
    updateDisplay('Error');
    calculation = '';
  } else {
    updateDisplay(String(result).replace('.', ','));
    calculation = String(result);
  }
  
  resetDisplay = true;
}

function handleDecimal() {
  const parts = calculation.split(/[+\-*/%]/).pop().trim();
  if (resetDisplay || parts === '') {
    calculation += '0,';
    resetDisplay = false;
  } else if (!parts.includes(',')) {
    calculation += ',';
  }
  updateDisplay(calculation);
}

function handleAllClear() {
  resetDisplay = false;
  calculation = '';
  updateDisplay('0');
}

function handleSignChange() {
  const value = parseFloat(display.textContent.replace(',', '.'));
  if (isNaN(value)) return;
  
  const newValue = -value;
  updateDisplay(String(newValue).replace('.', ','));
  calculation = String(newValue);
}

function operate(a, b, operator) {
  if (isNaN(a) || isNaN(b)) {
    return null;
  }

  switch (operator) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      if (b === 0) {
        return null;
      }
      return a / b;
    case '%':
      return a % b;
    default:
      return null;
  }
}

function calculateExpression(expression) {
  const cleanExpression = expression.replace(',', '.');
  const tokens = cleanExpression.match(/(\d+\.?\d*)|[+\-*/%]/g);
  if (!tokens || tokens.length === 0) return 0;
  
  let tempTokens = [];
  
  // First pass: Multiplication, Division, Modulo
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === '*' || tokens[i] === '/' || tokens[i] === '%') {
      const prevOperand = parseFloat(tempTokens.pop());
      const nextOperand = parseFloat(tokens[i + 1]);
      const result = operate(prevOperand, nextOperand, tokens[i]);
      if (result === null) return null;
      tempTokens.push(result);
      i++;
    } else {
      tempTokens.push(tokens[i]);
    }
  }

  // Second pass: Addition and Subtraction
  let result = parseFloat(tempTokens[0]);
  for (let i = 1; i < tempTokens.length; i++) {
    const operator = tempTokens[i];
    const nextOperand = parseFloat(tempTokens[i + 1]);
    result = operate(result, nextOperand, operator);
    i++;
  }

  return result;
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
      handleOperator('%');
    }
  });
});

themeSwitch.addEventListener('change', () => {
  document.body.classList.toggle('light-theme');
});