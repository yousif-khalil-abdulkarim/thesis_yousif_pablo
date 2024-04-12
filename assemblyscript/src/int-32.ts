export function max_int32_wasm(array: i32[]): i32 {
  let max = array[0];
  for (let i = 1; i < array.length; i++) {
    let item = array[i];
    if (item > max) max = item;
  }
  return max;
}
export function min_int32_wasm(array: i32[]): i32 {
  let min = array[0];
  for (let i = 1; i < array.length; i++) {
    let item = array[i];
    if (item < min) min = item;
  }
  return min;
}
export function sum_int32_wasm(array: i32[]): i32 {
  let sum = array[0];
  for (let i = 1; i < array.length; i++) {
    let item = array[i];
    sum += item;
  }
  return sum;
}
export function average_int32_wasm(array: i32[]): i32 {
  let sum = array[0];
  for (let i = 1; i < array.length; i++) {
    let item = array[i];
    sum += item;
  }
  return sum / array.length;
}

function swapTwo_int32_wasm(list: i32[], a: i32, b: i32): void {
  const itemA = list[a];
  list[a] = list[b];
  list[b] = itemA;
}
function sortTwo_int32_wasm(list: i32[], a: i32, b: i32): void {
  if (list[a] < list[b]) {
    swapTwo_int32_wasm(list, a, b);
  }
}

// Fungerar inte
export function bubbleSort_int32_wasm(array: i32[]): i32[] {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length + i - 1; j++) {
      sortTwo_int32_wasm(array, j + 1, j);
    }
  }
  return array;
}
export function selectionSort_int32_wasm(array: i32[]): i32[] {
  let min: i32;
  for (let i = 0; i < array.length; i++) {
    min = i;
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[min]) {
        min = j;
      }
    }
    if (min !== i) {
      swapTwo_int32_wasm(array, min, i);
    }
  }
  return array;
}
export function mergeSort_int32_wasm(list1: i32[], list2: i32[]): i32[] {
  let merged: i32[] = [],
    i: i32 = 0,
    j: i32 = 0;
  while (i < list1.length && j < list2.length) {
    if (list1[i] < list2[j]) {
      merged.push(list1[i]);
      i++;
    } else {
      merged.push(list2[j]);
      j++;
    }
  }
  while (i < list1.length) {
    merged.push(list1[i]);
    i++;
  }
  while (j < list2.length) {
    merged.push(list2[j]);
    j++;
  }
  return merged;
}

function getPivotIdx_int32_wasm(
  array: i32[],
  start: i32 = 0,
  end: i32 = array.length - 1
): i32 {
  let swapIdx: i32 = start;
  let pivotValue: i32 = array[start];
  for (let i = start + 1; i <= end; i++) {
    if (array[i] < pivotValue) {
      swapIdx++;
      swapTwo_int32_wasm(array, i, swapIdx);
    }
  }
  swapTwo_int32_wasm(array, start, swapIdx);
  return swapIdx;
}
function _quickSort_int32_wasm(array: i32[], left: i32, right: i32): i32[] {
  if (left < right) {
    let pivotIndex = getPivotIdx_int32_wasm(array, left, right);
    _quickSort_int32_wasm(array, left, pivotIndex - 1);
    _quickSort_int32_wasm(array, pivotIndex + 1, right);
  }
  return array;
}
export function quickSort_int32_wasm(array: i32[]): i32[] {
  return _quickSort_int32_wasm(array, 0, array.length - 1);
}

export function metaBinarySearch_int32_wasm(array: i32[], target: i32): i32 {
  let n = array.length;
  let interval_size = n;
  while (interval_size > 0) {
    let index = min(n - 1, interval_size / 2);
    let mid = array[index];
    if (mid == target) {
      return index;
    } else if (mid < target) {
      interval_size = (n - index) / 2;
    } else {
      interval_size = index / 2;
    }
  }
  return -1;
}
export function binarySearch_int32_wasm(array: i32[], target: i32): i32 {
  let startOffset = 0;
  let endOffset = array.length - 1;
  while (startOffset <= target) {
    let m = startOffset + (target - startOffset) / 2;
    if (array[m] == endOffset) {
      return m;
    }
    if (array[m] < endOffset) {
      startOffset = m + 1;
    } else {
      target = m - 1;
    }
  }
  return -1;
}
// Ej säker ifall den kommer fungera korrekt
export function jumpSearch_int32_wasm(
  array: i32[],
  target: i32,
  jump: i32
): i32 {
  let step = reinterpret<i32>(sqrt(reinterpret<f32>(jump)));

  let prev = 0;
  for (
    let minStep = min(step, jump) - 1;
    array[minStep] < target;
    minStep = min(step, jump) - 1
  ) {
    prev = step;
    step += reinterpret<i32>(sqrt(reinterpret<f32>(jump)));
    if (prev >= jump) {
      return -1;
    }
  }

  while (array[prev] < target) {
    prev++;

    if (prev == min(step, jump)) {
      return -1;
    }
  }
  if (array[prev] == target) {
    return prev;
  }

  return -1;
}

function _interpolationSearch_int32_wasm(
  array: i32[],
  startOffset: i32,
  endOffset: i32,
  target: i32
): i32 {
  let pos = -1;

  if (
    startOffset <= endOffset &&
    target >= array[startOffset] &&
    target <= array[endOffset]
  ) {
    pos =
      startOffset +
      ((endOffset - startOffset) / (array[endOffset] - array[startOffset])) *
        (target - array[startOffset]);

    if (array[pos] == target) {
      return pos;
    }

    if (array[pos] < target) {
      return _interpolationSearch_int32_wasm(array, pos + 1, endOffset, target);
    }

    if (array[pos] > target) {
      return _interpolationSearch_int32_wasm(
        array,
        startOffset,
        pos - 1,
        target
      );
    }
  }
  return -1;
}
export function interpolationSearch_int32_wasm(array: i32[], target: i32): i32 {
  return _interpolationSearch_int32_wasm(array, 0, array.length - 1, target);
}

export function matrixAddition_int32_wasm(
  matrixA: i32[][],
  matrixB: i32[][]
): i32[][] {
  const newMatrix: i32[][] = [];
  for (let i = 0; i < matrixA.length; i++) {
    newMatrix.push([]);
    for (let j = 0; j < matrixA[i].length; j++) {
      newMatrix[i].push(matrixA[i][j] + matrixB[i][j]);
    }
  }
  return newMatrix;
}
export function matrixSubraction_int32_wasm(
  matrixA: i32[][],
  matrixB: i32[][]
): i32[][] {
  const newMatrix: i32[][] = [];
  for (let i = 0; i < matrixA.length; i++) {
    newMatrix.push([]);
    for (let j = 0; j < matrixA[i].length; j++) {
      const cellA = matrixA[i][j];
      const cellB = matrixB[i][j];
      const newcell = cellA - cellB;
      newMatrix[i].push(newcell);
    }
  }
  return newMatrix;
}
