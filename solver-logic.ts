const { log } = console;

// ..9..5.1. 85.4....2 432...... 1...69.83 .9.....6. 62.71...9 ......194 5....4.37 .4.3..6..
// Solve this...

// The overall string to be solved
let str: string =
  "...4...8...5..8.6.92.....7.......2.8..7.....6...196...6..9.45.1....5.....49......";
// "9.......5.......46..3...72....4...69...7.3...56.9..4......8..57..215.....4...6.1.";
// "....13......68..1.7.9....8.....45..1..5..63..34.......5....9....7..6259..2......4";
// "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
// "5....28.......7..4..654.3..7..89...3.1....6.......4...8..35...9..7....8....2.....";

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

// let redo: boolean = true;
let redo: number = 0;

while (redo < 100) {
  board = board.map((item: any, index: number) => {
    return (item = item.map((item2: any, index2: number) => {
      if (item2 === "." || item2.length > 1) {
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
        if (item2.length > 1) {
          possibilities = item2;
        }
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
        // if (index === 0 && index2 === 3) {
        //   log("current square values", currentSquareValues);
        // }
        possibilities = possibilities.filter(
          (val3) => !currentSquareValues.includes(val3)
        );
        // if (index === 0 && index2 === 3) {
        //   log("after square filter", possibilities);
        // }
        // test current cell against other indeterminate cells in same square using array.flat()

        const uniqueValueInBoardRegion = (testArray: any[]) => {
          let flattenedSquare: string[] = testArray
            .filter((item: any) => typeof item === "object")
            .flat();

          function countOccurrences(arr: string[]): { [key: string]: number } {
            const count: { [key: string]: number } = {};
            arr.forEach((item) => {
              count[item] = (count[item] || 0) + 1;
            });
            return count;
          }

          let occurencesObj: { [key: string]: number } =
            countOccurrences(flattenedSquare);

          function findKeyWithValueEqualsOne(obj: {
            [key: string]: number;
          }): string | undefined {
            for (let key in obj) {
              if (obj[key] === 1) {
                return key;
              }
            }
          }

          let uniqueKey: any = findKeyWithValueEqualsOne(occurencesObj);
          if (possibilities.includes(uniqueKey)) {
            possibilities = [uniqueKey];
          }
        };

        if (possibilities.length > 1) {
          uniqueValueInBoardRegion(currentSquareValues);
          uniqueValueInBoardRegion(item);
          uniqueValueInBoardRegion(columnValues);
        }

        // if (index === 0 && index2 === 3) {
        //   console.log(
        //     "our flattened square of relevant values",
        //     flattenedSquare
        //   );
        // }

        // return value
        if (possibilities.length === 1) {
          return possibilities[0];
        } else {
          return possibilities;
        }
      } else {
        return item2;
      }
    }));
  });

  redo++;
  // redo = false;
  // board.forEach((arr: string[]) => {
  //   arr.includes(".") ? (redo = true) : null;
  // });
}

log("BOARD AFTER FILTERING", board);

// let reducedBoard: string[] = board.reduce(
//   (acc: [], curr: [], index: number) => {
//     let newAcc: string[] = [...acc];
//     curr.forEach((element) => {
//       if (typeof element === "object") {
//         newAcc.push(".");
//       } else if (typeof element === "string") {
//         newAcc.push(element);
//       }
//     });
//     return newAcc;
//   },
//   []
// );
let flattenedBoard: any[] = board.flat();

log("FLATTENED BOARD AFTER FIRST PASS", flattenedBoard);

flattenedBoard.forEach((item: string | [], index: number) => {
  let cell: any = document.querySelector(`#cell${index}`);
  cell.innerText = item;
});

// let cells: any = document.querySelectorAll("[id^='cell']");
// cells.forEach((item, index) => {
//   item.innerText = reducedBoard[index];
// });
