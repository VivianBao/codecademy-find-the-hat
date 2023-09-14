const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
let currentIndex = [0, 0];
let inGame = false;

class Field {
  constructor(fieldArray){
    this.field = fieldArray
  }

  static generateField(height, width, percent){
    //create empty field
    const newElements = Array(width).fill('');
    let newField = Array(height).fill([...newElements]);
    // shuffle fields and holes array
    const totalCharaCount = height*width - 1 //minus hat
    const holesNum = Math.round(totalCharaCount*(percent/100));
    const fieldNum = totalCharaCount - holesNum;
    let totalCharaArr = shuffle([...Array(holesNum).fill(hole), ...Array(fieldNum).fill(fieldCharacter)]);
    //set path location
    totalCharaArr.unshift(pathCharacter);
    //set fields and holes location
    let index = 0;
    newField = newField.map((row)=> {
      return row.map((element)=> {
        element = totalCharaArr[index];
        index++;
        return element
      });
    });
    // set hat location
    newField[getRandomInt(height - 1) + 1][getRandomInt(width)] = hat;

    return new this(newField);
  };

  print(){
    console.log(this.field.map(arr => `${arr.join('')}\n`).join(''));
  }

};

const getRandomInt = (num) => {
  return Math.floor(Math.random()*num);
};


const shuffle = (array) => {
  let currentIndex = array.length,  randomIndex;

  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

const msgFormatter = (msg) => {
  console.log(`\n${msg}\n`)
}

const titleGenerator = () => {
  console.log('---------------------------')
  console.log('\nWelcome to Find the Hat!')
}

const moveOneStep = (userInput, myField) => {
  let [curRow, curCol] = currentIndex;
  let nextIndex;
  switch(userInput){
    case 'R':
      nextIndex = [curRow, curCol + 1]
      break;
    case 'L':
      nextIndex = [curRow, curCol - 1]
      break;
    case 'U':
      nextIndex = [curRow - 1, curCol]
      break;
    case 'D':
      nextIndex = [curRow + 1, curCol]
      break;
    case 'RESTART':
      startGame();
    default:
      msgFormatter('Invalid Input. Try again!');

  }
  if(nextIndex){
    if(0 < nextIndex[0] < 3 && 0 < nextIndex[1] < 3 ){
      let nextCharacter = myField.field[nextIndex[0]][nextIndex[1]];
      switch(nextCharacter){
        case hat:
          msgFormatter('Congradulations! You found the goal!')
          playAgain();
          break;
        case hole:
          msgFormatter('Oops! You have fallen into a hole!')
          playAgain();
          break;
        case fieldCharacter:
          currentIndex = nextIndex;
          myField.field[nextIndex[0]][nextIndex[1]] = pathCharacter;
          break;
        default:
          msgFormatter('Woahhhh! That is a wall!')
          playAgain();
      }
    }else {
      msgFormatter('Oops! You have hit a wall!')
      inGame = false;
    }
  }

}
const playAgain = () => {
  inGame = false;
  let openSession = true;
  while(openSession){
    let userInput = prompt('Do you want to play again? (y/n)')
    userInput = userInput.toString().toUpperCase();
    switch(userInput){
      case "Y":
        startGame();
        openSession = false;
        break;
      case "N":
        msgFormatter('Until next time!');
        openSession = false;
        break;
      default:
        msgFormatter("Invalid input. Try Again!")
    }
  }
}
const startGame = () => {
  const myField = Field.generateField(6,8, 20);
  inGame = true;
  titleGenerator();
  while(inGame){
    console.log('\n---------------------------\n')
    myField.print()
    msgFormatter("Let's get started!")
    let userInput = prompt("Choose which way you want to go (r/l/u/d) or Start a new game (restart)")
    userInput = userInput.toString().toUpperCase();
    moveOneStep(userInput, myField)
  }
}

startGame();
