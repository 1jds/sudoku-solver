"use strict";
const { log } = console;
// The overall string to be solved
let str = "...4...8...5..8.6.92.....7.......2.8..7.....6...196...6..9.45.1....5.....49......";
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
let board = str
    .split("")
    .reduce((acc, curr, index) => {
    const innerIndex = Math.floor(index / 9);
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
let redo = 0;
while (redo < 100) {
    board = board.map((item, index) => {
        return (item = item.map((item2, index2) => {
            if (item2 === "." || item2.length > 1) {
                // set up possibilites for current cell
                let possibilities = [
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
                let columnValues = [];
                let counter = 0;
                while (counter < 9) {
                    columnValues.push(board[counter][index2]);
                    counter++;
                }
                // step 2 - filter out from remaining possibilites any matches in the current column
                possibilities = possibilities.filter((val2) => !columnValues.includes(val2));
                // if (index === 0 && index2 === 3) {
                //   log("after column filter", possibilities);
                // }
                // filter out from possibilities any values already in the current 9x9 square of cells
                // step 1 - build up current square values
                let squareRowStart = 0;
                let squareColumnStart = 0;
                // 'index / 3 <= 1' tests whether we are in the first square from top to bottom
                if (index / 3 < 1) {
                    // we need 0, 1, 2
                    squareRowStart = 0;
                }
                else if (index / 3 >= 1 && index / 3 < 2) {
                    // we need 3, 4, 5
                    squareRowStart = 3;
                }
                else {
                    // we need 6, 7, 8
                    squareRowStart = 6;
                }
                // 'index2 /3 <= 1' tests whether we are in the first square from left to right
                if (index2 / 3 < 1) {
                    squareColumnStart = 0;
                }
                else if (index2 / 3 >= 1 && index2 / 3 < 2) {
                    squareColumnStart = 3;
                }
                else {
                    squareColumnStart = 6;
                }
                let currentSquareValues = [
                    ...board[squareRowStart].slice(squareColumnStart, squareColumnStart + 3),
                    ...board[squareRowStart + 1].slice(squareColumnStart, squareColumnStart + 3),
                    ...board[squareRowStart + 2].slice(squareColumnStart, squareColumnStart + 3),
                ];
                // if (index === 0 && index2 === 3) {
                //   log("current square values", currentSquareValues);
                // }
                // if (index === 0 && index2 === 3) {
                //   log("current square values", currentSquareValues);
                // }
                // step 2 - filter out matches in current square
                possibilities = possibilities.filter((val3) => !currentSquareValues.includes(val3));
                // if (index === 0 && index2 === 3) {
                //   log("after square filter", possibilities);
                // }
                // create a function to test current cell against other indeterminate cells in same region
                // to see if there are unique values among the possibilites for the region
                // a 'board region' means either the current square, or current column, or current row
                // if the current cell's list of possibilites contains a value unique to the region,
                // then the proper value of that cell must be the unique value identified in the region
                const uniqueValueInBoardRegion = (testArray) => {
                    let flattenedSquare = testArray
                        .filter((item) => typeof item === "object")
                        .flat();
                    function countOccurrences(arr) {
                        const count = {};
                        arr.forEach((item) => {
                            count[item] = (count[item] || 0) + 1;
                        });
                        return count;
                    }
                    let occurencesObj = countOccurrences(flattenedSquare);
                    function findFirstKeyWithValueEqualsOne(obj) {
                        for (let key in obj) {
                            if (obj[key] === 1) {
                                return key;
                            }
                        }
                    }
                    let uniqueKey = findFirstKeyWithValueEqualsOne(occurencesObj);
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
                }
                else {
                    return possibilities;
                }
            }
            else {
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
let redo2 = 0;
while (redo2 < 100) {
    board = board.map((item, index) => {
        return (item = item.map((item2, index2) => {
            if (item2.length > 1) {
                // set up possibilites for current cell
                let possibilities = item2;
                if (possibilities.length === 1) {
                    return possibilities[0];
                }
                else {
                    return possibilities;
                }
            }
            else {
                return item2;
            }
        }));
    });
    redo2++;
}
