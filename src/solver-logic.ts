"use strict";
const { log } = console;

// The overall string to be solved
let str =
  "..5..839..3..........7...8...45..6.261.......2...49........24.5..9.8....56.......";
// "...4...8...5..8.6.92.....7.......2.8..7.....6...196...6..9.45.1....5.....49......";

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

// Helper functions
const findSquare = (
  gridIndex: number,
  rowIndex: number
): { squareRowStart: number; squareColumnStart: number } => {
  let squareRowStart: number = 0;
  let squareColumnStart: number = 0;
  // 'gridIndex / 3 <= 1' tests whether we are in the first square from top to bottom
  if (gridIndex / 3 < 1) {
    squareRowStart = 0;
  } else if (gridIndex / 3 >= 1 && gridIndex / 3 < 2) {
    squareRowStart = 3;
  } else {
    squareRowStart = 6;
  }
  // 'rowIndex /3 <= 1' tests whether we are in the first square from left to right
  if (rowIndex / 3 < 1) {
    squareColumnStart = 0;
  } else if (rowIndex / 3 >= 1 && rowIndex / 3 < 2) {
    squareColumnStart = 3;
  } else {
    squareColumnStart = 6;
  }
  return {
    squareRowStart,
    squareColumnStart,
  };
};

const getColumnValues = (currentRowIndex: number): string[] => {
  let column: string[] = [];
  let counter: number = 0;
  while (counter < 9) {
    column.push(board[counter][currentRowIndex]);
    counter++;
  }
  return column;
};
// End of helper functions

// establish a condition so that we don't loop forever;
// I should change this at the end,
// maybe like 'let redo: boolean = true'
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

        // ROW FILTER
        // filter out from possibilites any values already in the row of current cell
        possibilities = possibilities.filter((val) => !item.includes(val));

        // COLUMN FILTER
        // filter out from possibilities any values already in the column of current cell
        let columnValues = getColumnValues(index2);
        possibilities = possibilities.filter(
          (val2) => !columnValues.includes(val2)
        );

        // SQUARE FILTER
        // filter out from possibilities any values already in the current 9x9 square of cells
        let currentSquare = findSquare(index, index2);
        let currentSquareValues: string[] = [
          ...board[currentSquare.squareRowStart].slice(
            currentSquare.squareColumnStart,
            currentSquare.squareColumnStart + 3
          ),

          ...board[currentSquare.squareRowStart + 1].slice(
            currentSquare.squareColumnStart,
            currentSquare.squareColumnStart + 3
          ),

          ...board[currentSquare.squareRowStart + 2].slice(
            currentSquare.squareColumnStart,
            currentSquare.squareColumnStart + 3
          ),
        ];
        possibilities = possibilities.filter(
          (val3) => !currentSquareValues.includes(val3)
        );

        // UNIQUE IN REGION
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

  log("BOARD AFTER FIRST FILTERING", board);

  board = board.map((item: any, index: number) => {
    // remove values for magic pairs such as two cells which have ["2","3"] in a row
    // this means that no other cells in that row can properly contain a "2" or a "3" and,
    // as such, those can be filtered out
    let magicPair: string[] = [];
    let index1: number = 0;
    let index2: number = 0;

    // map over 'item' which is one of the nine rows in the sudoku board
    item.forEach((itm: any, indx: number) => {
      // for each item/cell in this row, check if it is an array of two items
      if (typeof itm === "object" && itm.length === 2) {
        // if so, cut off the rest of the row after the found pair
        let restOfRow = item.slice(indx + 1);
        // map over the rest of the row and see if there is another cell with the same pair of values
        restOfRow.forEach((itm2: any, indx2: number) => {
          if (itm2.length === 2 && itm[0] === itm2[0] && itm[1] === itm2[1]) {
            // if a magic pair is found, store it in this variable
            magicPair = [...itm];
            // // store where the first of these pairs appears in the row (its index in the row)
            index1 = indx;
            // store where the second of these pairs appears in the row (its index in the row)
            index2 = indx + 1 + indx2;
          }
        });
      }
    });

    let itemCopy = item.map((cell: any, indx: number) => {
      if (typeof cell === "string") {
        return cell;
      } else if (indx === index1 || indx === index2) {
        return cell;
      } else {
        // filter out any magicPair[0] or magicPair[1] values from this cell's array
        let cellCopy = cell.filter(
          (value: string) => !magicPair.includes(value)
        );
        if (cellCopy.length === 1) {
          return cellCopy[0];
        } else {
          return cellCopy;
        }
      }
    });
    return itemCopy;
  });
  log("BOARD AFTER SECOND FILTERING", board);

  // find magic pairs in columns
  board.forEach((item: any, index: number) => {
    let magicPair: string[] = [];
    // these are now row indexes from the first dimension of the board array
    let index1: number = 0;
    let index2: number = 0;
    let stableColumnIndex: number = 0;
    let columnValues: string[] = [];

    // map over 'columnValues' which is one of the nine columns in the sudoku board
    item.forEach((item2: any, indx2: number) => {
      stableColumnIndex = indx2;
      columnValues = getColumnValues(indx2);
      // for each item/cell in this row, check if it is an array of two items
      columnValues.forEach((itm: any, indx: number) => {
        if (typeof itm === "object" && itm.length === 2) {
          let restOfColumn = itm.slice(indx + 1);
          restOfColumn.forEach((itm2: any, indx3: number) => {
            if (itm2.length === 2 && itm[0] === itm2[0] && itm[1] === itm2[1]) {
              // if a magic pair is found, store it in this variable
              magicPair = [...itm];
              // store where the first of these pairs appears in the column (its index in the column)
              index1 = indx;
              // store where the second of these pairs appears in the column (its index in the column)
              index2 = indx + 1 + indx3;
            }
          });
        }
      });
    });

    columnValues.forEach((cell: any, indx: number) => {
      if (typeof cell === "string") {
        return undefined;
      } else if (indx === index1 || indx === index2) {
        return undefined;
      } else {
        // filter out any magicPair[0] or magicPair[1] values from this cell's array
        let cellCopy = cell.filter(
          (value: string) => !magicPair.includes(value)
        );
        if (cellCopy.length === 1) {
          board[indx][stableColumnIndex] = cellCopy[0];
          log("this got fired 1");
        } else {
          board[indx][stableColumnIndex] = cellCopy;
          log("this got fired 2", indx, stableColumnIndex, cellCopy);
        }
      }
    });
  });
  // board = board.map((item: any, index: number) => {
  //   return(
  //     item = item.map((item2: any, indx2: number) => {
  //       if (item2.length > 1) {
  //         let columnValues = getColumnValues(indx2);

  //         let possibilities = [...item2]

  //       } else {
  //         return item2
  //       }
  //     })
  //   )

  // });

  // find magic pairs in squares

  // find triples such as [1,3], [1,3,4], [1,3,4] in rows
  // find triples such as [1,3], [1,3,4], [1,3,4] in columns
  // find triples such as [1,3], [1,3,4], [1,3,4] in squares

  redo++;
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

// This is commented out for ts-node execution, but needs to be unedited for HTML injection...
// let flattenedBoard: any[] = board.flat();
// log("FLATTENED BOARD AFTER FIRST PASS", flattenedBoard);
// flattenedBoard.forEach((item: string | [], index: number) => {
//   let cell: any = document.querySelector(`#cell${index}`);
//   cell.innerText = item;
// });
