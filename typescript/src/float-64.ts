export function max_float64_js(array: number[]): number {
  let max = array[0];
  for (let i = 1; i < array.length; i++) {
    let item = array[i];
    if (item > max) max = item;
  }
  return max;
}
export function min_float64_js(array: number[]): number {
  let min = array[0];
  for (let i = 1; i < array.length; i++) {
    let item = array[i];
    if (item < min) min = item;
  }
  return min;
}
export function sum_float64_js(array: number[]): number {
  let sum = array[0];
  for (let i = 1; i < array.length; i++) {
    let item = array[i];
    sum += item;
  }
  return sum;
}
export function average_float64_js(array: number[]): number {
  let sum = array[0];
  for (let i = 1; i < array.length; i++) {
    let item = array[i];
    sum += item;
  }
  return sum / array.length;
}

function swapTwo_float64_js(list: number[], a: number, b: number): void {
  const itemA = list[a];
  list[a] = list[b];
  list[b] = itemA;
}
function sortTwo_float64_js(list: number[], a: number, b: number): void {
  if (list[a] < list[b]) {
    swapTwo_float64_js(list, a, b);
  }
}

export function bubbleSort_float64_js(array: number[]): number[] {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length + i - 1; j++) {
      sortTwo_float64_js(array, j + 1, j);
    }
  }
  return array;
}
export function selectionSort_float64_js(array: number[]): number[] {
  let min: number;
  for (let i = 0; i < array.length; i++) {
    min = i;
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[min]) {
        min = j;
      }
    }
    if (min !== i) {
      swapTwo_float64_js(array, min, i);
    }
  }
  return array;
}
export function mergeSort_float64_js(
  list1: number[],
  list2: number[]
): number[] {
  let merged: number[] = [],
    i: number = 0,
    j: number = 0;
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

function getPivotIdx_float64_js(
  array: number[],
  start: number = 0,
  end: number = array.length - 1
): number {
  let swapIdx: number = start;
  let pivotValue: number = array[start];
  for (let i = start + 1; i <= end; i++) {
    if (array[i] < pivotValue) {
      swapIdx++;
      swapTwo_float64_js(array, i, swapIdx);
    }
  }
  swapTwo_float64_js(array, start, swapIdx);
  return swapIdx;
}
function _quickSort_float64_js(
  array: number[],
  left: number,
  right: number
): number[] {
  if (left < right) {
    let pivotIndex = getPivotIdx_float64_js(array, left, right);
    _quickSort_float64_js(array, left, pivotIndex - 1);
    _quickSort_float64_js(array, pivotIndex + 1, right);
  }
  return array;
}
export function quickSort_float64_js(array: number[]): number[] {
  return _quickSort_float64_js(array, 0, array.length - 1);
}

export function metaBinarySearch_float64_js(
  array: number[],
  target: number
): number {
  let n = array.length;
  let interval_size = n;
  while (interval_size > 0) {
    let index = Math.min(n - 1, interval_size / 2);
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
export function binarySearch_float64_js(
  array: number[],
  target: number
): number {
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
export function jumpSearch_float64_js(
  array: number[],
  target: number,
  jump: number
): number {
  let step = Math.sqrt(jump);

  let prev = 0;
  for (
    let minStep = Math.min(step, jump) - 1;
    array[minStep] < target;
    minStep = Math.min(step, jump) - 1
  ) {
    prev = step;
    step += Math.sqrt(jump);
    if (prev >= jump) {
      return -1;
    }
  }

  while (array[prev] < target) {
    prev++;

    if (prev == Math.min(step, jump)) {
      return -1;
    }
  }
  if (array[prev] == target) {
    return prev;
  }

  return -1;
}

function _interpolationSearch_float64_js(
  array: number[],
  startOffset: number,
  endOffset: number,
  target: number
): number {
  let pos = -1;

  if (
    startOffset <= endOffset &&
    target >= array[startOffset] &&
    target <= array[endOffset]
  ) {
    pos =
      startOffset +
      Math.floor(
        ((endOffset - startOffset) / (array[endOffset] - array[startOffset])) *
          (target - array[startOffset])
      );

    if (array[pos] == target) {
      return pos;
    }

    if (array[pos] < target) {
      return _interpolationSearch_float64_js(array, pos + 1, endOffset, target);
    }

    if (array[pos] > target) {
      return _interpolationSearch_float64_js(
        array,
        startOffset,
        pos - 1,
        target
      );
    }
  }
  return -1;
}
export function interpolationSearch_float64_js(
  array: number[],
  target: number
): number {
  return _interpolationSearch_float64_js(array, 0, array.length - 1, target);
}

export function matrixAddition_float64_js(
  matrixA: number[][],
  matrixB: number[][]
): number[][] {
  const newMatrix: number[][] = [];
  for (let i = 0; i < matrixA.length; i++) {
    newMatrix.push([]);
    for (let j = 0; j < matrixA[i].length; j++) {
      newMatrix[i].push(matrixA[i][j] + matrixB[i][j]);
    }
  }
  return newMatrix;
}
export function matrixSubraction_float64_js(
  matrixA: number[][],
  matrixB: number[][]
): number[][] {
  const newMatrix: number[][] = [];
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
