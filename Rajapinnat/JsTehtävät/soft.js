//a teht.
const prompt = require('prompt-sync')();

function logBigger() {
    var num1=prompt("Enter the first number:");

    var num2 = prompt("Enter the second number:");

    if (num1<num2){
        console.log(`The bigger number is: ${num2}`);
    }
    else if (num1>num2){
        console.log(`The bigger number is: ${num1}`);
    }
    else {
        console.log('Both numbers are equal.');
}
};
logBigger();

//b teht.

function isPalindrome(word) {
    const reversedWord = word.split('').reverse().join('');
    return word === reversedWord;
}

const word = prompt("Enter a word to check if it's a palindrome:");
if (isPalindrome(word)) {
    console.log(`${word} is a palindrome.`);
} else {
    console.log(`${word} is not a palindrome.`);
}

