let isRomanMode = false;

document.addEventListener('DOMContentLoaded', (event) => {
    document.addEventListener('keydown', handleKeydown);
    toggleMode();
    toggleMode(); 
});

function appendToDisplay(value) {
    const display = document.getElementById('display');
    display.value += value;
}

function clearDisplay() {
    document.getElementById('display').value = '';
}

function calculate() {
    const display = document.getElementById('display');
    const expression = display.value;

    try {
        const result = isRomanMode ? evaluateRomanExpression(expression) : eval(expression);
        display.value = isRomanMode ? arabicToRoman(result) : result;
    } catch (e) {
        display.value = 'Erro';
    }
}

function toggleMode() {
    isRomanMode = !isRomanMode;
    const modeButton = document.querySelector('button:last-child');
    modeButton.textContent = isRomanMode ? 'Modo Normal' : 'Modo Romano';
    clearDisplay();
    
    const romanButtons = document.querySelectorAll('.roman');
    const normalButtons = document.querySelectorAll('.normal');
    const operatorButtons = document.querySelectorAll('.operator');

    romanButtons.forEach(button => {
        button.disabled = !isRomanMode;
    });

    normalButtons.forEach(button => {
        button.disabled = isRomanMode;
    });

    operatorButtons.forEach(button => {
        button.disabled = false;
    });
}

function evaluateRomanExpression(expression) {
    const romanToArabic = (roman) => {
        const romanNumeralMap = {
            'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000
        };
        let result = 0;
        for (let i = 0; i < roman.length; i++) {
            const current = romanNumeralMap[roman[i]];
            const next = romanNumeralMap[roman[i + 1]];
            if (next && current < next) {
                result -= current;
            } else {
                result += current;
            }
        }
        return result;
    };

    const parseExpression = (expression) => {
        const romanNumeralRegex = /[IVXLCDM]+/g;
        expression = expression.replace(romanNumeralRegex, (match) => romanToArabic(match));
        return eval(expression);
    };

    return parseExpression(expression);
}

function arabicToRoman(num) {
    const romanNumeralMap = [
        ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400], ['C', 100], ['XC', 90],
        ['L', 50], ['XL', 40], ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
    ];
    let result = '';
    for (const [roman, value] of romanNumeralMap) {
        while (num >= value) {
            result += roman;
            num -= value;
        }
    }
    return result;
}

function handleKeydown(event) {
    const key = event.key;

    if (!isRomanMode && (key >= '0' && key <= '9')) {
        appendToDisplay(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendToDisplay(key);
    } else if (key === 'Enter') {
        event.preventDefault();
        calculate();
    } else if (key === 'Backspace') {
        const display = document.getElementById('display');
        display.value = display.value.slice(0, -1);
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (isRomanMode && 'IVXLCDM'.includes(key.toUpperCase())) {
        appendToDisplay(key.toUpperCase());
    }
}
