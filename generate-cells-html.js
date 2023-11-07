let arr = [];

let row1 = 0;
let row2 = 9;
let row3 = 18;
let count = 0;
while (count < 9) {
  let item = `<div class="board-square board-item">
          <div id="cell${row1}" class="board-cell board-item">A</div>
          <div id="cell${row1 + 1}" class="board-cell board-item">B</div>
          <div id="cell${row1 + 2}" class="board-cell board-item">C</div>
          <div id="cell${row2}" class="board-cell board-item">D</div>
          <div id="cell${row2 + 1}" class="board-cell board-item">E</div>
          <div id="cell${row2 + 2}" class="board-cell board-item">F</div>
          <div id="cell${row3}" class="board-cell board-item">G</div>
          <div id="cell${row3 + 1}" class="board-cell board-item">H</div>
          <div id="cell${row3 + 2}" class="board-cell board-item">I</div>
        </div>`;
  arr.push(item);
  if (count < 2) {
    row1 = row1 + 3;
    row2 = row2 + 3;
    row3 = row3 + 3;
  } else if (count === 2) {
    row1 = row1 + 21;
    row2 = row2 + 21;
    row3 = row3 + 21;
  } else if (count === 3 || count === 4) {
    row1 = row1 + 3;
    row2 = row2 + 3;
    row3 = row3 + 3;
  } else if (count === 5) {
    row1 = row1 + 21;
    row2 = row2 + 21;
    row3 = row3 + 21;
  } else {
    row1 = row1 + 3;
    row2 = row2 + 3;
    row3 = row3 + 3;
  }
  count++;
}

let str = arr.toString();

console.log(str);
