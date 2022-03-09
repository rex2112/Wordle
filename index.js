const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const { endianness } = require('os');
const port = 8080;

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// --------- Express Routes definition ---------
app.get('/', (req, res) => {
    console.log('req.query:');
    console.log(req.query);
    const formParams = req.query;
    const response = '<this is where the filtered words will be displayed>';
    res.render('home', { words: [response], formParams });
});

app.post('/', (req, res) => {
    console.log('req.body:');
    var response = '';
    const formParams = req.body;
    const { dict_select, correctPositions, wrongPositions, lettersNotFound } =
        formParams;
    console.log(formParams);
    if (!dict_select) {
        response = 'You must select a dictionary.';
        console.log(`Response: ${response}`);
        res.render('home', { words: [response], formParams });
    } else if (!correctPositions && !wrongPositions && !lettersNotFound) {
        response = 'You must enter at least a word filter.';
        console.log(`Response: ${response}`);
        res.render('home', { words: [response], formParams });
    } else {
        const words = GetWords(dictionaries[dict_select], formParams);
        res.render('home', { words, formParams });
    }
});

app.get('*', (req, res) => {
    res.send('I do not know the path!');
});

// Start of program logic

const enDictFile = 'en5.lst';
const esDictFile = 'es5.lst';

var enDict = new Set();
var allFileContents = fs.readFileSync(enDictFile, 'utf-8');
allFileContents.split(/\r?\n/).forEach((line) => {
    enDict.add(line);
});

var esDict = new Set();
allFileContents = fs.readFileSync(esDictFile, 'utf-8');
allFileContents.split(/\r?\n/).forEach((line) => {
    esDict.add(line);
});

const dictionaries = {
    en: enDict,
    es: esDict,
};

console.log(`Number of words ${enDictFile}: ${enDict.size}`);
console.log(`Number of words ${esDictFile}: ${esDict.size}`);

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

function GetWords(dictionary, formParams) {
    var fiveLetterWords = new Set(dictionary);

    correctPositions = formParams.correctPositions;
    var array = correctPositions.split(' ');

    array.forEach((letterAndPosition) => {
        const letter = letterAndPosition.substring(0, 1);
        const position = letterAndPosition.substring(1, 2);
        // isValid(letter);
        // isValid(position);
        if (letter != '') {
            KeepWordsWithLettersInPositivePositions(
                fiveLetterWords,
                letter,
                position
            );
        }
    });

    wrongPositions = formParams.wrongPositions;
    var array = wrongPositions.split(' ');

    array.forEach((letterAndPosition) => {
        const letter = letterAndPosition.substring(0, 1);
        const position = letterAndPosition.substring(1, 2);
        if (letter != '') {
            RemoveWordWithLocalizedLetter(fiveLetterWords, letter, position);
        }
    });

    lettersNotFound = formParams.lettersNotFound;
    var array = lettersNotFound.split(' ');

    console.log(`Length: ${array.length}`);
    if (array[0] != 0) {
        RemoveWordsWithoutLetters(fiveLetterWords, array);
    }

    return fiveLetterWords;
}

// No necesitamos requerir (require) 'ejs' porque
// express lo llama en automático con el parámetro 'view engine'
app.set('view engine', 'ejs');

app.listen(port, () => {
    console.log(`LISTENING ON ${port}`);
});
