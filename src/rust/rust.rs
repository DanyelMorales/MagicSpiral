/***
 * Usage:
 * 
 * rustc rust.rs && ./rust [number]
 */
use std::env;

enum Direction {
    UP, DOWN
}

struct Limit {
    size: i64,
    direction: Direction,
    last_limit: i64,
    limit: i64
}

struct SubLimits {
    from:i64,
    to_y:i64,
    from_x:i64,
    to_x: i64,
    size: i64
}

fn main(){
    let args: Vec<String> = env::args().collect();
    let n = args[1].parse::<i64>().unwrap();
    let matrix:Vec<Vec<i64>> =  create_spiral(n);

    println!("{}", format_matrix(matrix));
}

fn format_matrix(matrix:Vec<Vec<i64>>) -> String{ 
    let row = |prev, next| format!("{}\t{}", &prev, &next);
    let column:Vec<String> = matrix.iter().map(|x| x.iter().fold("".to_string(), row)).collect();
    column.iter().fold("".to_string(), |prev, next| format!("{}\n{}", &prev, &next))
}

/**
 * Create Spiral main function.
 * 
 * @param n Matrix Length
 * @return the magical spiral as a Matrix
 */
fn create_spiral(n:i64) ->Vec<Vec<i64>> {
    let mut direction: Direction = Direction::UP;
    let mut buffer:Vec<Vec<i64>> = Vec::new();
    buffer.push(Vec::new());
    
    let mut last_limit = 0; 

    for i in 1..=n {
        let limit = Limit {
            size: i,
            direction: direction,
            last_limit: last_limit,
            limit: i.pow(2)
        };
        
        direction = match limit.direction {
            Direction::DOWN => Direction::UP,
            Direction::UP => Direction::DOWN,
        };

        last_limit = limit.limit;
        buffer = add_l(&mut buffer, &limit);
    }
    buffer
}

/**
 *  Takes the direction of the current L and delegates
 * to the corresponding L generator.
 * 
 *  @param tmpArr main array 
 *  @param limit  object with properties belonging to the current "L"
 */
fn add_l(merge_arr:&mut Vec<Vec<i64>>, limit:&Limit) -> Vec<Vec<i64>>{
 match limit.direction {
        Direction::DOWN => down_l(merge_arr, limit),
        Direction::UP => up_l(merge_arr, limit),
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
fn down_l(mut merge_arr:&mut  Vec<Vec<i64>>, limit:&Limit) -> Vec<Vec<i64>>{
    let mut tmp_arr = create_new_array(limit.size);
    let sub_limits = create_sublimits(limit);

    let mut y = 0;
    for i in sub_limits.from ..=sub_limits.to_y {
        tmp_arr[y as usize][sub_limits.size  as usize]= i;
        y +=1;
    }
    let mut x = 0 ;
    for i in (sub_limits.from_x ..= sub_limits.to_x).rev() {
        tmp_arr[sub_limits.size as usize][x as usize] = i;
        x+=1;
    }

    merge_l(&mut tmp_arr, &mut merge_arr, Direction::DOWN, limit.size);
    return tmp_arr;
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
fn up_l(mut merge_arr:&mut  Vec<Vec<i64>>, limit:&Limit) -> Vec<Vec<i64>>{
    let mut tmp_arr = create_new_array(limit.size);
    let sub_limits = create_sublimits(limit);

    let mut y = sub_limits.size;
    for i  in sub_limits.from ..=sub_limits.to_y {
        tmp_arr[y as usize].splice(0..1, [i].iter().cloned());
        y -=1;
    }
    let mut x = 1;
    for i in sub_limits.from_x ..=sub_limits.to_x {
        tmp_arr[0][x as usize]=i;
        x+=1;
    }

    merge_l(&mut tmp_arr, &mut merge_arr, Direction::UP, limit.size);
    tmp_arr
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
fn merge_l(base:&mut Vec<Vec<i64>>,  arr:&mut Vec<Vec<i64>>, direction:Direction, size:i64) {
    for ty in 0..(size - 1) {
        for tx in 0..(size - 1) {
            match direction {
                Direction::DOWN => base[ty  as usize ][tx  as usize] = arr[ty as usize][tx as usize],
                Direction::UP =>  base[(ty + 1) as usize][(tx + 1) as usize] = arr[ty as usize][tx as usize],
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
fn create_sublimits(limit:&Limit) -> SubLimits {
    let from = limit.last_limit + 1;
    let to_y = from + (limit.size - 1) ;
    let from_x = to_y + 1;
    let to_x = from_x + (limit.size  - 2);
    let size = limit.size - 1;
    SubLimits {
        from: from,
        to_y: to_y,
        from_x: from_x,
        to_x: to_x,
        size: size
    }
}

/**
 * Create a matrix of n size.
 * 
 * @param height the size of the matrix
 */
fn create_new_array(height: i64) -> Vec<Vec<i64>>{
    let tmp_arr: Vec<Vec<i64>> = vec![vec![-1; height as usize];height as usize];
    tmp_arr
}