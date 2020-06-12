let n = process.argv.slice(2);


function init(n) {
    let caracol = new Array();
    let direction = "UP"; // > < -
    let limits = [];

    let lastLimit = 0;
    for (let i = 1; i <= n; i++) {
        let limit = {
            size: i,
            direction: direction,
            lastLimit: lastLimit,
            limit: Math.pow(i, 2)
        };

        if (direction == "UP") {
            direction = "DOWN";
        } else if (direction == "DOWN") {
            direction = "UP";
        }
        limits.push(limit);
        caracol.push(new Array());
        lastLimit = limit.limit;
    }

    let lastUsed = [];
    for (let limit of limits) {
        lastUsed = addL(lastUsed, limit);
    }

    return lastUsed;
}

/**
 * 
 */
function addL(tmpArr, limit) {
    if (limit.direction == "DOWN") {
        return downL(tmpArr, limit);
    } else if (limit.direction == "UP") {
        return upL(tmpArr, limit);
    }

}

function downL(mergeArr, limit) {
    let tmpArr = new Array();

    let createY = function(from, to, size) {
        for (let i = from, y = 0; i <= to; y++, i++) {
            tmpArr[y][size] = (i);
        }
    };
    let createX = function(from, to, size) {
        for (let i = to, x = 0; i >= from; x++, i--) {
            tmpArr[size][x] = (i);
        }
    };

    for (let h = 0; h < limit.size; h++) {
        tmpArr.push(new Array());
    }

    let from = limit.lastLimit + 1;
    let toY = from + (limit.size - 1);
    let fromX = toY + 1;
    let toX = fromX + (limit.size - 2);

    createY(from, toY, limit.size - 1);
    createX(fromX, toX, limit.size - 1);

    // merge Arr, we sum 1 because we have now an offset for the current arr
    for (let ty = 0; ty < limit.size - 1; ty++) {
        for (let tx = 0; tx < limit.size - 1; tx++) {
            tmpArr[ty][tx] = mergeArr[ty][tx];
        }
    }
    return tmpArr;
}

function upL(mergeArr, limit) {

    let tmpArr = new Array();
    tmpArr.push(new Array());

    let createY = function(from, to, size) {
        for (let i = from, y = size; i <= to; y--, i++) {
            tmpArr[y].unshift(i);
        }
    };
    let createX = function(from, to) {
        for (let i = from, x = 1; i <= to; x++, i++) {
            tmpArr[0].push(i);
        }
    };


    for (let h = 0; h < limit.size; h++) {
        tmpArr.push(new Array());
    }


    let from = limit.lastLimit + 1;
    let toY = from + (limit.size - 1);
    let fromX = toY + 1;
    let toX = fromX + (limit.size - 2);
    createY(from, toY, limit.size - 1);
    createX(fromX, toX, limit.size - 1);

    for (let ty = 0; ty < limit.size - 1; ty++) {
        for (let tx = 0; tx < limit.size - 1; tx++) {
            tmpArr[ty + 1][tx + 1] = mergeArr[ty][tx];
        }
    }
    return tmpArr;

}

let view = init(n).map((y) => y.join("\t")).join("\n");
console.log(view);