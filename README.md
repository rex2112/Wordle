# Wordle Solver

This is a simple web that aids in solving the <a href="https://www.nytimes.com/games/wordle/index.html">Wordle</a> online puzzle and all its variants.

The application expects a dictionary file and the three letters combinations given the following criteria:

- Words with letters in positive (correct) positions (format 'a4' or 'f5', space separated)
- Words with letters present in word but in an incorrect position (format 'a4' or 'f5', space separated)
- Words with letters not present in the word (format: 'j k o' - space separated)

Currently I only have a dictionary for English and Spanish, already filtered into five-letter words. If you would like additional dictionaries included you can let me know and I will make the corresponding adjustments. The only changers necessary are to the html file (home.ejs) to have them available in the dictionary drop-down box.

I will eventually include basic validation but as of now you should know the basic rules of the game to know what is expected from the user. That is, you should take into account the game rules to include letter filters or else the app won't work.

I am open to any suggestions or code improvements.
