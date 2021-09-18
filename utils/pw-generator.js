const randomFunctions = [randomUppercase, randomLowercase, randomNumber, randomSymbol]

//functions to create random password acceptable characters
function randomUppercase() {
    return String.fromCharCode(Math.floor(Math.random()*26+65))
}

function randomLowercase() {
    return String.fromCharCode(Math.floor(Math.random()*26+97))
}

function randomNumber() {
    return String.fromCharCode(Math.floor(Math.random()*10+48))
}

function randomSymbol() {
    const symbols = '~!@#$%^&*()_-+={[}]|;<,>.?/'
    return symbols[Math.floor(Math.random()*symbols.length)]
}

//create 20 character long password using random functions
function generatePassword() {
    pw = ''
    for(let i = 0; i<5; i++) {
        randomFunctions.forEach(element => {
            pw += element()
        });
    }
    return pw
}

module.exports = {
    generatePassword
}
