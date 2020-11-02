import re
from re import split

def add(a, b):
    a = int(a)
    b = int(b)
    return a + b

def subtract(a, b):
    a = int(a)
    b = int(b)
    return a - b

def arithmetic_arranger(problems, doSolve=False):

    # Loop through input
    # For each element
    # Split up into a list of 3 elements
    # check 1 & 3 elements for only numbers
    # check 1 & 3 elements for one to four digits in length
    # check 2 element for only + & - operators

    # problems example = ["32 + 698", "3801 - 2", "45 + 43", "123 + 49"]

    if(len(problems) > 5):
        return 'Error: Too many problems.'
        
    lineOneFinal = []
    lineTwoFinal = []
    lineThreeFinal = []
    lineFourFinal = []
    result = []
    spaceBetweenProblems = ''
    spaceBetweenCount = 4
    for n in range(spaceBetweenCount):
        spaceBetweenProblems = spaceBetweenProblems + ' '

    for equation in problems:
        # equation = '32 + 698' - string
        splitString = equation.split() # ['32', '+', '698']
        firstOperand = splitString[0]
        secondOperand = splitString[2]
        operator = splitString[1]
        onlyNumbersRegex = '^[0-9]+$' # only numbers
        onlyAddOrSubtractRegex = '^\+|-$' # only + or - characters one in length
        # search / match returns a match object (considered true for boolean evaluations), or None
        firstOperandIsOnlyNumbers = re.search(onlyNumbersRegex, firstOperand)
        secondOperandIsOnlyNumbers = re.search(onlyNumbersRegex, secondOperand)
        isCorrectOperator = re.search(onlyAddOrSubtractRegex, operator)
        digitCountRegex = '^[0-9]{1,4}$' # only numbers one to four characters in length
        firstOperandHasCorrectDigitCount = re.search(digitCountRegex, firstOperand)
        secondOperandHasCorrectDigitCount = re.search(digitCountRegex, secondOperand)

        if(not isCorrectOperator):
            return "Error: Operator must be '+' or '-'."

        if(not firstOperandIsOnlyNumbers or not secondOperandIsOnlyNumbers):
            return "Error: Numbers must only contain digits."

        if(not firstOperandHasCorrectDigitCount or not secondOperandHasCorrectDigitCount):
            return "Error: Numbers cannot be more than four digits."

        # If reached this point user has supplied correct format of problems.
        lineOne = firstOperand
        lineTwo = f'{operator} {secondOperand}'
        lineThree = ''
        lineFour = ''
        answer = None
        additionalSpaces = ''

        # get length of string that is larger
        if(len(firstOperand) >= len(secondOperand)):
            maxStringLength = len(firstOperand) + 2
            lineOne = f'  {firstOperand}'
            spaceCount = maxStringLength - (1 + len(secondOperand))
            for n in range(spaceCount):
                additionalSpaces = additionalSpaces + ' '
            lineTwo = f'{operator}{additionalSpaces}{secondOperand}'
        else:
            maxStringLength = len(secondOperand) + 2
            spaceCount = maxStringLength - len(firstOperand)
            for n in range(spaceCount):
                additionalSpaces = additionalSpaces + ' '
            lineOne = f'{additionalSpaces}{firstOperand}'

        for n in range(maxStringLength):
            lineThree = lineThree + '-'

        lineOneFinal.append(lineOne)
        lineTwoFinal.append(lineTwo)
        lineThreeFinal.append(lineThree)

        if(doSolve):
            answer = add(firstOperand, secondOperand) if operator == '+' else subtract(firstOperand, secondOperand)
            additionalSpaces = ''
            for n in range(maxStringLength - len(f'{answer}')):
                additionalSpaces = additionalSpaces + ' '
            lineFour = f'{additionalSpaces}{answer}'
            lineFourFinal.append(lineFour)

    result.append(spaceBetweenProblems.join(lineOneFinal))
    result.append(spaceBetweenProblems.join(lineTwoFinal))
    result.append(spaceBetweenProblems.join(lineThreeFinal))
    if(doSolve):
        result.append(spaceBetweenProblems.join(lineFourFinal))
    result = '\n'.join(result)

    return result