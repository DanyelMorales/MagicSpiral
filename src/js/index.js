/***
 * Usage:
 * 
 * node javascript.js [number]
 */

// Retrieve Matrix length from arg
let n = process.argv.slice(2);

/**
 * Create Spiral main function.
 * 
 * @param n Matrix Length
 * @return the magical spiral as a Matrix
 */
function createSpiral(n) {
    let direction = "UP";
    let buffer = [];
    let lastLimit = 0;

    for (let i = 1; i <= n; i++) {
        let limit = {
            size: i,
            direction: direction,
            lastLimit: lastLimit,
            limit: Math.pow(i, 2)
        };

        // add L to the matrix
        buffer = addL(buffer, limit);

        // changing direction for the next L
        if (direction == "UP") {
            direction = "DOWN";
        } else if (direction == "DOWN") {
            direction = "UP";
        }

        lastLimit = limit.limit;
    }
    return buffer;
}

/**
 *  Takes the direction of the current L and delegates
 * to the corresponding L generator.
 * 
 *  @param tmpArr main array 
 *  @param limit  object with properties belonging to the current "L"
 */
function addL(tmpArr, limit) {
    if (limit.direction == "DOWN") {
        return downL(tmpArr, limit);
    } else if (limit.direction == "UP") {
        return upL(tmpArr, limit);
    }
}

/**
 * Create a reversed L bottom
 * 
 * Create the column of the L figure. The numbers in the column are in ascendant mode:
 * [10]
 * [11]
 * [12]
 * [13]
 * 
 * Then creates the row of the L figure. The numbers in the row are in descendant mode.
 * [16][15][14][13]
 *  
 * The final array looks like this:
 * [  ][  ][  ][10]
 * [  ][  ][  ][11]
 * [  ][  ][  ][12]
 * [16][15][14][13]
 *
 * @param mergeArr Matrix to be merged with the current L
 * @param limit object with properties belonging to the current "L"
 * @return new Array with a partial spiral created 
 */
function downL(mergeArr, limit) {
    let tmpArr = createNewArray(limit.size);
    let subLimits = createSubLimits(limit);
    for (let i = subLimits.from, y = 0; i <= subLimits.toY; y++, i++) {
        tmpArr[y][subLimits.size] = (i);
    }
    for (let i = subLimits.toX, x = 0; i >= subLimits.fromX; x++, i--) {
        tmpArr[subLimits.size][x] = (i);
    }
    mergeL(tmpArr, mergeArr, "DOWN", limit.size);
    return tmpArr;
}

/**
 * Create a reversed L top
 * 
 * Create the column of the L figure. The numbers in the column are in descendant mode:
 * [7]
 * [6]
 * [5]
 * 
 * Then creates the row of the L figure. The numbers in the row are in ascendant mode.
 * [ 7][ 8][ 9]
 *  
 * The final array looks like this:
 * [ 7][ 8][ 9]
 * [ 6][  ][  ]
 * [ 5][  ][  ]
 * 
 * @param mergeArr Matrix to be merged with the current L
 * @param limit object with properties belonging to the current "L"
 * @return new Array with a partial spiral created 
 */
function upL(mergeArr, limit) {
    let tmpArr = createNewArray(limit.size);
    let subLimits = createSubLimits(limit);
    for (let i = subLimits.from, y = subLimits.size; i <= subLimits.toY; y--, i++) {
        tmpArr[y].unshift(i);
    }
    for (let i = subLimits.fromX, x = 1; i <= subLimits.toX; x++, i++) {
        tmpArr[0].push(i);
    }
    mergeL(tmpArr, mergeArr, "UP", limit.size);
    return tmpArr;
}

/**
 * Merge two arrays, each array is an "L" of the spiral
 * 
 * Direction UP:
 * Iterates over the size of matrix to be merged
 * Takes the base array, and add 1 to x and y axis in the base array 
 * to reallocate the merged array values. 
 * 
 * Direction DOWN:
 * Iterates over the size of matrix to be merged. Takes the base array
 * and maps exactly x and y with the array to be merged.
 * 
 *  
 * @param base primary array 
 * @param arr  array to be merged
 * @param direction type of L to be merged:  UP | DOWN
 * @param size of the matrix to be merged 
 */
function mergeL(base, arr, direction, size) {
    for (let ty = 0; ty < size - 1; ty++) {
        for (let tx = 0; tx < size - 1; tx++) {
            if (direction == "UP") {
                base[ty + 1][tx + 1] = arr[ty][tx];
            } else if (direction == "DOWN") {
                base[ty][tx] = arr[ty][tx];
            }
        }
    }
}

/** 
 * Calculates the limits of axis Y and X for the current spiral part.
 * 
 * @param limit current L 
 * @return {
 *  from: L starting point for axis Y,
 *  toY: end point of axis y,
 *  fromX: starting point for axis X,
 *  toX: end point for axis  x,
 *  size: size of the current matrix,
 * }
 */
function createSubLimits(limit) {
    let from = limit.lastLimit + 1;
    let toY = from + (limit.size - 1);
    let fromX = toY + 1;
    let toX = fromX + (limit.size - 2);
    let size = limit.size - 1;
    return {
        from: from,
        toY: toY,
        fromX: fromX,
        toX: toX,
        size: size
    };
}

/**
 * Create a matrix of n size.
 * 
 * @param height the size of the matrix
 */
function createNewArray(height) {
    let tmpArr = new Array();
    for (let h = 0; h < height; h++) {
        tmpArr.push(new Array());
    }
    return tmpArr;
}

let view = createSpiral(n).map((y) => y.join("\t")).join("\n");
console.log(view);