const { log } = console;

// ..9..5.1. 85.4....2 432...... 1...69.83 .9.....6. 62.71...9 ......194 5....4.37 .4.3..6..
// Solve this...

// The overall string to be solved
let str: string =
  "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";

let board: any[] = str
  .split("")
  .reduce((acc: any[], curr: string, index: number) => {
    const innerIndex: number = Math.floor(index / 9);
    if (!acc[innerIndex]) {
      acc[innerIndex] = [];
    }
    acc[innerIndex].push(curr);
    return acc;
  }, []);

log("BOARD BEFORE FILTERING", board);

let redo: boolean = true;

while (redo === true) {
  board = board.map((item: any, index: number) => {
    return (item = item.map((item2: any, index2: number) => {
      if (item2 === ".") {
        // set up possibilites for current cell
        let possibilities: string[] = [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
        ];
        // if (index === 0 && index2 === 3) {
        //   log("before any filtering", possibilities);
        // }
        // filter out from possibilites any values already in the row of current cell
        possibilities = possibilities.filter((val) => !item.includes(val));
        // if (index === 0 && index2 === 3) {
        //   log("after row filter", possibilities);
        // }
        // filter out from possibilities any values already in the column of current cell
        let columnValues: string[] = [];
        let counter: number = 0;
        while (counter < 9) {
          columnValues.push(board[counter][index2]);
          counter++;
        }
        possibilities = possibilities.filter(
          (val2) => !columnValues.includes(val2)
        );
        // if (index === 0 && index2 === 3) {
        //   log("after column filter", possibilities);
        // }
        // filter out from possibilities any values already in the current 9x9 square of cells
        let squareRowStart: number = 0;
        let squareColumnStart: number = 0;
        // 'index / 3 <= 1' tests whether we are in the first square from top to bottom
        if (index / 3 < 1) {
          // we need 0, 1, 2
          squareRowStart = 0;
        } else if (index / 3 >= 1 && index / 3 < 2) {
          // we need 3, 4, 5
          squareRowStart = 3;
        } else {
          // we need 6, 7, 8
          squareRowStart = 6;
        }
        // 'index2 /3 <= 1' tests whether we are in the first square from left to right
        if (index2 / 3 < 1) {
          squareColumnStart = 0;
        } else if (index2 / 3 >= 1 && index2 / 3 < 2) {
          squareColumnStart = 3;
        } else {
          squareColumnStart = 6;
        }

        let currentSquareValues: string[] = [
          ...board[squareRowStart].slice(
            squareColumnStart,
            squareColumnStart + 3
          ),

          ...board[squareRowStart + 1].slice(
            squareColumnStart,
            squareColumnStart + 3
          ),

          ...board[squareRowStart + 2].slice(
            squareColumnStart,
            squareColumnStart + 3
          ),
        ];
        // if (index === 0 && index2 === 3) {
        //   log("current square values", currentSquareValues);
        // }
        possibilities = possibilities.filter(
          (val3) => !currentSquareValues.includes(val3)
        );
        // if (index === 0 && index2 === 3) {
        //   log("after square filter", possibilities);
        // }
        if (possibilities.length === 1) {
          return possibilities[0];
        } else {
          return ".";
        }
      } else {
        return item2;
      }
    }));
  });
  redo = false;
  board.forEach((arr: string[]) => {
    arr.includes(".") ? (redo = true) : null;
  });
}
log("BOARD AFTER FILTERING", board);

// // The item that one is currently attempting to solve
// let item = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

// let square = str.slice(0, 3) + str.slice(9, 12) + str.slice(18, 21);
// let row = str.slice(0, 9);
// let column =
//   str[0] +
//   str[9] +
//   str[18] +
//   str[27] +
//   str[36] +
//   str[45] +
//   str[54] +
//   str[63] +
//   str[72];

// let all = square + row + column;

// let eliminateArray = all.split("").filter((item) => item !== ".");

// let filteredItem = item.filter((item) => {
//   if (!eliminateArray.includes(item)) {
//     return item;
//   }
// });

// if (filteredItem.length === 1) {
// }

// log(filteredItem);
