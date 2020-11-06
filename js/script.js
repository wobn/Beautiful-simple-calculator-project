class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement
        this.currentOperandTextElement = currentOperandTextElement
        this.readyToReset = false;
        this.clear()
    }

    clear() {
        this.currentOperand = ''
        this.previousOperand = ''
        this.operation = undefined
        document.getElementById('modalImage').innerHTML = ''
    }

    delete() {
        if (this.readyToReset) return
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return
        this.currentOperand = this.currentOperand.toString() + number.toString()
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return
        if (this.previousOperand != '') {
            this.compute()
        }
        this.operation = operation
        this.previousOperand = this.currentOperand
        this.currentOperand = ''
    }

    compute() {
        let computation
        const prev = parseFloat(this.previousOperand)
        const current = parseFloat(this.currentOperand)
        if (isNaN(prev) || isNaN(current)) return
        switch (this.operation) {
            case '+':
                computation  = prev + current
                break
            case '-':
                computation  = prev - current
                break
            case '*':
                computation  = prev * current
                break
            case '÷':
                computation  = prev / current
                break
            default:
                return
        }
        this.readyToReset = true;
        this.currentOperand = computation
        this.operation = undefined
        this.previousOperand = ''
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString()
        const integerDigits = parseFloat(stringNumber.split('.')[0])
        const decimalDigits = stringNumber.split('.')[1]
        let integerDisplay
        if (isNaN(integerDigits)) {
            integerDisplay = ''
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`
        } else {
            return integerDisplay
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand)
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
        } else {
            this.previousOperandTextElement.innerText = ''
        }

        // An easter egg
        let currentOperandText = this.currentOperandTextElement.innerText
        if (currentOperandText === '42') {
            document.getElementById('modalImage').innerHTML = ''
            this.showMeme("img/42-the-answer-to-life-universe-and-everything.png")
        } else if (this.currentOperandTextElement.innerText === '9,000') {
            document.getElementById('modalImage').innerHTML = ''
            this.showMeme("img/over9000.gif")
        }
    }

    showMeme(src) {
        Swal.fire({
            imageUrl: src,
            imageAlt: 'A meme',
            
            timer: 2000,
            timerProgressBar: true,
          })
    }
}


const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
    button.addEventListener('click', () => {

        if (calculator.previousOperand === '' && calculator.currentOperand !== '' && calculator.readyToReset) {
            calculator.currentOperand = ''
            calculator.readyToReset = false
        }

        calculator.appendNumber(button.innerText)
        calculator.updateDisplay()
    })
})

// Keybord typed numbers
document.onkeypress = function(e) {
    e = e || window.event;
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    var typedChar = String.fromCharCode(charCode)
    /*
    if (charCode) {
        alert("Character typed: " + String.fromCharCode(charCode));
    }
    */
    // alert("Character typed: " + charCode)
    if (!isNaN(parseInt(typedChar)) || typedChar === '.') {
        calculator.appendNumber(typedChar)
        calculator.updateDisplay()
    } else if ((typedChar === '=' || charCode === 13)) {
        calculator.compute()
        calculator.updateDisplay()
        if (charCode === 13) calculator.showMeme("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEhW9umJJvsJGO6xumu8ARE9ISfocHjSA5tuAbjUv14O-glAuL")
    } else if (charCode === 32) {
        calculator.clear()
        calculator.updateDisplay()
    } else if (typedChar === '/' || typedChar === '*' || typedChar === '+' || typedChar === '-') {
        calculator.chooseOperation(typedChar)
        calculator.updateDisplay()
    }
};

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText)
        calculator.updateDisplay()
    })
})

equalsButton.addEventListener('click', button => {
    calculator.compute()
    calculator.updateDisplay()
})

allClearButton.addEventListener('click', button => {
    calculator.clear()
    calculator.updateDisplay()
})

deleteButton.addEventListener('click', button => {
    calculator.delete()
    calculator.updateDisplay()
})