let n = process.argv.slice(2);

/**
 * 
 * Caracol mágico
 * 
 * Es requerido calcular las L que existen. Cada L es un nuevo array que se mezclara con la L anterior.
 * Existen dos tipos de L: Superior e inferior.  
 * 
 * Para la L inferior es necesario calcular primero la columna "Y" y posteriormente la fila "X":
 * 
 * ....para calcular y: 
 *              Y añade los valores de x con push. Los valores de x aumentan de arriba a abajo.
 * ....para calcular x: 
 *              X añade los valores con unshift de forma descendente.
 * 
 * Para la L inferior es necesario calcular primero la columna "Y" y posteriormente la fila "X".
 * 
 * ....para calcular y: 
 *      Los valores en Y van con un unshift de forma descendente
 * ....para calcular x: 
 *      Los valores en x van con push de forma ascendente
 * 
 * 
 * 
 * Existen dos tipos de L, los superiores e inferiores. En ambos casos primero se calcula la columna Y y luego la columna X, 
 * sin embargo, cuando se continua el calculo de sobre X debera tener cuidado de continuar donde se quedo la columna Y. 
 * 
 * Por cada iteración de las eles a calcular, se va rotando, si toca L superior, la siguiente es una inferior y así sucesivamente.
 * En cada iteración existe un merge de arrays donde se recalibra el anterior y se hace merge sobre el nuevo calculo.
 * 
 */
function init(n) {
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

        buffer = addL(buffer, limit);

        // changing direction of L
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

function mergeL(base, arr, direction, size) {
    if (direction == "UP") {
        for (let ty = 0; ty < size - 1; ty++) {
            for (let tx = 0; tx < size - 1; tx++) {
                base[ty + 1][tx + 1] = arr[ty][tx];
            }
        }
    } else if (direction == "DOWN") {
        for (let ty = 0; ty < size - 1; ty++) {
            for (let tx = 0; tx < size - 1; tx++) {
                base[ty][tx] = arr[ty][tx];
            }
        }
    }
}

function createSubLimits(limit) {
    let from = limit.lastLimit + 1;
    let toY = from + (limit.size - 1);
    let fromX = toY + 1;
    let toX = fromX + (limit.size - 2);

    return {
        from: limit.lastLimit + 1,
        toY: toY,
        fromX: fromX,
        toX: toX,
        size: limit.size - 1
    };
}

function createNewArray(height) {
    let tmpArr = new Array();
    for (let h = 0; h < height; h++) {
        tmpArr.push(new Array());
    }
    return tmpArr;
}

let view = init(n).map((y) => y.join("\t")).join("\n");
console.log(view);