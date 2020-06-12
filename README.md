
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