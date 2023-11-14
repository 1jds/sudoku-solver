"use strict";
const { log } = console;

// The overall string to be solved
let str =
  "...4...8...5..8.6.92.....7.......2.8..7.....6...196...6..9.45.1....5.....49......";

// Create a 9x9 board comprised of an array with nine nested arrays each containing nine items
// [
//  ['.', '.', '.', '4', '.', '.', '.', '8', '.']
//  ['.', '.', '5', '.', '.', '8', '.', '6', '.']
//  ['9', '2', '.', '.', '.', '.', '.', '7', '.']
//  ['.', '.', '.', '.', '.', '.', '2', '.', '8']
//  ['.', '.', '7', '.', '.', '.', '.', '.', '6']
//  ['.', '.', '.', '1', '9', '6', '.', '.', '.']
//  ['6', '.', '.', '9', '.', '4', '5', '.', '1']
//  ['.', '.', '.', '.', '5', '.', '.', '.', '.']
//  ['.', '4', '9', '.', '.', '.', '.', '.', '.']
// ]

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

// establish a condition so that we don't loop forever;
// I should change this at the end,
/// maybe like 'let redo: boolean = true'
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
        // step 1 - build up current column values
        let columnValues: string[] = [];
        let counter: number = 0;
        while (counter < 9) {
          columnValues.push(board[counter][index2]);
          counter++;
        }
        // step 2 - filter out from remaining possibilites any matches in the current column
        possibilities = possibilities.filter(
          (val2) => !columnValues.includes(val2)
        );
        // if (index === 0 && index2 === 3) {
        //   log("after column filter", possibilities);
        // }

        // filter out from possibilities any values already in the current 9x9 square of cells
        // step 1 - build up current square values
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
        // step 2 - filter out matches in current square
        possibilities = possibilities.filter(
          (val3) => !currentSquareValues.includes(val3)
        );

        // if (index === 0 && index2 === 3) {
        //   log("after square filter", possibilities);
        // }

        // create a function to test current cell against other indeterminate cells in same region
        // to see if there are unique values among the possibilites for the region
        // a 'board region' means either the current square, or current column, or current row
        // if the current cell's list of possibilites contains a value unique to the region,
        // then the proper value of that cell must be the unique value identified in the region
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

          function findFirstKeyWithValueEqualsOne(obj: {
            [key: string]: number;
          }): string | undefined {
            for (let key in obj) {
              if (obj[key] === 1) {
                return key;
              }
            }
          }

          let uniqueKey: any = findFirstKeyWithValueEqualsOne(occurencesObj);
          if (possibilities.includes(uniqueKey)) {
            possibilities = [uniqueKey];
          }
        };

        // call the function created above on the three relevant regions: viz. the row, column, and square
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

let redo2: number = 0;

while (redo2 < 100) {
  board = board.map((item: any, index: number) => {
    return (item = item.map((item2: any, index2: number) => {
      if (item2.length > 1) {
        // set up possibilites for current cell
        let possibilities = item2;

        //remove values for magic pairs such as two cells which have ["2","3"] in a row
        // this means that no other cells in that row can properly contain a "2" or a "3" and,
        // as such, those can be filtered out
        let magicPair: string[] = [];
        let index1: number;
        let index2: number;
        item.forEach((itm: any, indx: number) => {
          if (typeof itm === "object" && itm.length === 2) {
            let restOfRow = item.slice(index + 1);
            restOfRow.forEach((itm2: any, indx2: number) => {
              if (
                itm2.length === 2 &&
                itm[0] === itm2[0] &&
                itm[1] === itm2[1]
              ) {
                magicPair = [...itm];
                index1 = indx;
                index2 = indx + 1 + indx2;
              }
            });
          }
        });
        item = item.map((itm: any, indx: number) => {
          if (typeof itm === "string") {
            return itm;
          } else if (indx === index1 || index === index2) {
            return itm;
          } else {
            //filter out any magicPair[0] or magicPair[1] values from this array
            itm = itm.filter((value: string) => !magicPair.includes(value));
          }
        });

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

  redo2++;
}

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

// let flattenedBoard: any[] = board.flat();
// log("FLATTENED BOARD AFTER FIRST PASS", flattenedBoard);

// This is commented out for ts-node execution, but needs to be unedited for HTML injection...
// flattenedBoard.forEach((item: string | [], index: number) => {
//   let cell: any = document.querySelector(`#cell${index}`);
//   cell.innerText = item;
// });

// THIS WHOLE BLOCK IS CAUSING PROBLEMS.
// I THINK IT IS BECAUSE I AM CALLING item = item.map
// INSIDE WHAT I START WITH AT 31 WHICH IS ALSO item = item.map.
// I GUESS I COULD TRY TO CHANGE THIS SO THAT IT ALL HAPPENS AFTER THE BLOCK STARTING AT 31...
// OR ELSE I COULD JUST FILTER THE CURRENT CELL RATHER THAN THE ENTIRE ROW AT ONCE...
