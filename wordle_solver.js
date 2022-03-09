const fs = require('fs');

if (process.argv.length <= 2) {
    console.log(`Usage: ${process.argv[1]} <dictionary_file>`);
    process.exit(0);
}

const fileName = process.argv[2];
console.log(`Dictionary file: ${fileName}`);

var fiveLetterWords = new Set();
const allFileContents = fs.readFileSync(fileName, 'utf-8');
allFileContents.split(/\r?\n/).forEach((line) => {
    fiveLetterWords.add(line);
});

console.log(`Number of words: ${fiveLetterWords.size}`);

// Functions definition

function KeepWordsWithLettersInPositivePositions(
    currentWords,
    letter,
    position
) {
    console.log(
        `-------- Removing words with '${letter}' NOT in position ${position} --------`
    );
    const index = position - 1;
    currentWords.forEach((word) => {
        if (word.indexOf(letter, index, index + 1) != index) {
            currentWords.delete(word);
            // process.stdout.write(`${word} `);
        }
    });
    return currentWords;
}

function RemoveWordWithLocalizedLetter(currentWords, letter, position) {
    console.log(
        `-------- Removing words with '${letter}' in WRONG position ${position} --------`
    );
    const index = position - 1;
    currentWords.forEach((word) => {
        if (word.indexOf(letter, index, index + 1) == index) {
            currentWords.delete(word);
        }
        if (word.indexOf(letter) == -1) {
            currentWords.delete(word);
        }
    });
    return currentWords;
}

function RemoveWordsWithoutLetters(currentWords, letters) {
    console.log(`-------- Removing words with letters: '${letters}' --------`);
    letters.forEach((letter) => {
        currentWords.forEach((word) => {
            const positionFound = word.indexOf(letter);
            if (positionFound >= 0) {
                currentWords.delete(word);
            }
        });
    });
}

// Main Program

console.log('------------- INIT --------------');

// KeepWordsWithLettersInPositivePositions(fiveLetterWords, 'o', 5);
// KeepWordsWithLettersInPositivePositions(fiveLetterWords, 'o', 5);

RemoveWordWithLocalizedLetter(fiveLetterWords, 'a', 1);
RemoveWordWithLocalizedLetter(fiveLetterWords, 'd', 2);
RemoveWordWithLocalizedLetter(fiveLetterWords, 'o', 3);

RemoveWordsWithoutLetters(fiveLetterWords, ['i', 'e', 'u', 'p', 't']);

console.log();
fiveLetterWords.forEach((word) => process.stdout.write(`${word} `));
console.log();
console.log();
