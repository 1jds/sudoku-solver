var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var log = console.log;
// ..9..5.1. 85.4....2 432...... 1...69.83 .9.....6. 62.71...9 ......194 5....4.37 .4.3..6..
// Solve this...
// The overall string to be solved
var str = "...4...8...5..8.6.92.....7.......2.8..7.....6...196...6..9.45.1....5.....49......";
// "9.......5.......46..3...72....4...69...7.3...56.9..4......8..57..215.....4...6.1.";
// "....13......68..1.7.9....8.....45..1..5..63..34.......5....9....7..6259..2......4";
// "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
// "5....28.......7..4..654.3..7..89...3.1....6.......4...8..35...9..7....8....2.....";
var board = str
    .split("")
    .reduce(function (acc, curr, index) {
    var innerIndex = Math.floor(index / 9);
    if (!acc[innerIndex]) {
        acc[innerIndex] = [];
    }
    acc[innerIndex].push(curr);
    return acc;
}, []);
log("BOARD BEFORE FILTERING", board);
// let redo: boolean = true;
var redo = 0;
while (redo < 100) {
    board = board.map(function (item, index) {
        return (item = item.map(function (item2, index2) {
            if (item2 === "." || item2.length > 1) {
                // set up possibilites for current cell
                var possibilities_1 = [
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
                    possibilities_1 = item2;
                }
                // if (index === 0 && index2 === 3) {
                //   log("before any filtering", possibilities);
                // }
                // filter out from possibilites any values already in the row of current cell
                possibilities_1 = possibilities_1.filter(function (val) { return !item.includes(val); });
                // if (index === 0 && index2 === 3) {
                //   log("after row filter", possibilities);
                // }
                // filter out from possibilities any values already in the column of current cell
                var columnValues_1 = [];
                var counter = 0;
                while (counter < 9) {
                    columnValues_1.push(board[counter][index2]);
                    counter++;
                }
                possibilities_1 = possibilities_1.filter(function (val2) { return !columnValues_1.includes(val2); });
                // if (index === 0 && index2 === 3) {
                //   log("after column filter", possibilities);
                // }
                // filter out from possibilities any values already in the current 9x9 square of cells
                var squareRowStart = 0;
                var squareColumnStart = 0;
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
                var currentSquareValues_1 = __spreadArray(__spreadArray(__spreadArray([], board[squareRowStart].slice(squareColumnStart, squareColumnStart + 3), true), board[squareRowStart + 1].slice(squareColumnStart, squareColumnStart + 3), true), board[squareRowStart + 2].slice(squareColumnStart, squareColumnStart + 3), true);
                // if (index === 0 && index2 === 3) {
                //   log("current square values", currentSquareValues);
                // }
                // if (index === 0 && index2 === 3) {
                //   log("current square values", currentSquareValues);
                // }
                possibilities_1 = possibilities_1.filter(function (val3) { return !currentSquareValues_1.includes(val3); });
                // if (index === 0 && index2 === 3) {
                //   log("after square filter", possibilities);
                // }
                // test current cell against other indeterminate cells in same square using array.flat()
                var uniqueValueInBoardRegion = function (testArray) {
                    var flattenedSquare = testArray
                        .filter(function (item) { return typeof item === "object"; })
                        .flat();
                    function countOccurrences(arr) {
                        var count = {};
                        arr.forEach(function (item) {
                            count[item] = (count[item] || 0) + 1;
                        });
                        return count;
                    }
                    var occurencesObj = countOccurrences(flattenedSquare);
                    function findKeyWithValueEqualsOne(obj) {
                        for (var key in obj) {
                            if (obj[key] === 1) {
                                return key;
                            }
                        }
                    }
                    var uniqueKey = findKeyWithValueEqualsOne(occurencesObj);
                    if (possibilities_1.includes(uniqueKey)) {
                        possibilities_1 = [uniqueKey];
                    }
                };
                if (possibilities_1.length > 1) {
                    uniqueValueInBoardRegion(currentSquareValues_1);
                    uniqueValueInBoardRegion(item);
                    uniqueValueInBoardRegion(columnValues_1);
                }
                // if (index === 0 && index2 === 3) {
                //   console.log(
                //     "our flattened square of relevant values",
                //     flattenedSquare
                //   );
                // }
                // return value
                if (possibilities_1.length === 1) {
                    return possibilities_1[0];
                }
                else {
                    return possibilities_1;
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
var flattenedBoard = board.flat();
log("FLATTENED BOARD AFTER FIRST PASS", flattenedBoard);
flattenedBoard.forEach(function (item, index) {
    var cell = document.querySelector("#cell".concat(index));
    cell.innerText = item;
});
// let cells: any = document.querySelectorAll("[id^='cell']");
// cells.forEach((item, index) => {
//   item.innerText = reducedBoard[index];
// });
