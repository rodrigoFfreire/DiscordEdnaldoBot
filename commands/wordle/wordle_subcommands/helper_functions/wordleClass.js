/**
 * @param {String} guess - guessed word
 * @param {String} secret  - secret word
 * @param {Number} size - size of word (Default : 5)
 */

const Wordle = class {
    constructor(guess, secret, size = 5) {
      this.size = size;
      this.guess = [...guess];
      this.secret = [...secret];
      this.secretCopy = [...this.secret];
      this.colors = [];
      for (let i = 0; i < size; i++) this.colors.push(0);
    }

    checkPos = index => {
        return this.guess[index] === this.secret[index] ? true : false;
    };

    checkExists = index => {
        return this.secret.find((element) => element === this.guess[index]) &&
        this.secretCopy.find((element) => element === this.guess[index])
        ? true
        : false;
    };

    removeCopyIndex = i => {
        const index = this.secretCopy.findIndex((letter) => {
            return this.guess[i] == letter;
        });
        this.secretCopy.splice(index, 1);
    }

    logic = () => {
        for (let i = 0; i < this.size; i++) {
            if (this.checkPos(i) && this.checkExists(i)) {
              this.removeCopyIndex(i);
              this.colors[i] = 3; //Green
            } else if (!this.checkPos(i) && this.checkExists(i)) {
              this.removeCopyIndex(i);
              this.colors[i] = 2; //Yellow
            } else {
              this.colors[i] = 1; // Black
            }
          }
    }
}

module.exports = Wordle;
