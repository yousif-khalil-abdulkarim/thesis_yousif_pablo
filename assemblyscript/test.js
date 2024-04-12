// @ts-check
import { selectionSort_int32_wasm } from "./dist/release.js";

/**
 *
 * @param {number[]} array
 */
function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

const array = [1, 2, 3, 4, 5, 6, 7, 8];
shuffle(array);
console.log(array);
console.log(selectionSort_int32_wasm(array));
