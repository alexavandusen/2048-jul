// define all functions 
//TO DO: format these functions using js doc 
import R from "./ramda.js";


const twentyfourtyeight = Object.create(null);

/** 
 * @namespace twentyfourtyeight
 * @author Alexa Van Dusen
 * @version 2021/22
 */

/**
 * A
 * Board is an square grid that tiles are placed into each turn.
 * The tiles are placed randomly.
 * With each go, the player shifts the board and identicaltiles add.
 * It is implemented as an array of tiles.
 * (or empty spots)
 * @memberof twentyfourtyeight
 * @typedef {twentyfourtyeight.tile_or_empty[][]} Board
 */

/**
 * A tile is a number that has been placed in the grid.
 * With each go, a 2 or a 4 is placed
 * However, larger numbers can be made by adding the tiles.
 * @memberof twentyfourtyeight
 * @typedef {(2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048)} Tile
 */

/**
 * Either a tile or an empty position.
 * @memberof twentyfourtyeight
 * @typedef {(twentyfourtyeight.Tile | 0)} tile_or_empty
 */

/**
 * create an array.
 * @memberof twentyfourtyeight
 * @function
 * @param {number} [width = 4] 
 * @param {number} [height = 4]
 */
 twentyfourtyeight.empty_board = function(width = 4, height = 4){
    return R.repeat(R.repeat(0,height), width);
};

/*
 * Creating new tiles.
 * @memberof twentyfourtyeight
 * @function
 * @param {twentyfourtyeight.Board} board
 * @returns {twentyfourtyeight.Tile} 2 or 4
 */
twentyfourtyeight.generate_tile = function(board, find_empty_tiles){
    let tile_value = choose_tile([2,2,2,2,2,2,4]) // probability of getting a 2 much higher
    let possible_placement = find_empty_tiles(board)
    let placement = choose_tile(possible_placement)
    return set_square(board, placement, tile_value)
}

const choose_tile = array => {
    let placement = Math.floor(Math.random() * (R.length(array)))
    return array[placement]
}

const set_square = (board, [row, column], value) => {
    let pre = R.take(row, board)
    let mid = concat(R.take(column, board[row]), [value], R.drop(column + 1,
        board[row]))
    let post = R.drop(row + 1, board)
    return R.concat(R.append(mid, pre), post)
}
const concat = function (grid, index, val){
    return R.concat(R.concat(grid, index, val))
}

/**
 * Find empty tiles.
 * @memberof twentyfourtyeight
 * @function
 * @param {twentyfourtyeight.Board} board
 * @returns {number[]} array of the indices of the free tiles
 */

twentyfourtyeight.find_empty_tiles = function (board){
    let one_row = function(num){
        return R.zip(R.repeat(num, 4), [0,1,2,3])
    };
    let coordinates = R.unnest(R.map(one_row, [0,1,2,3]));
    return R.filter(([row,column]) => board[row][column] === 0, coordinates)
};


/**
 * Returns an array of which column numbers are free to place a new number in.
 * @memberof twentyfourtyeight
 * @function
 * @param {twentyfourtyeight.Board} board The board to check for free columns.
 * @returns {number[]} An array of column indices of free columns.
 */
 twentyfourtyeight.free_columns = R.pipe(
    R.addIndex(R.map)((column, index) => (
        R.includes(0, column)
        ? index
        : -1
    )),
    R.reject(R.equals(-1))
);
/**
 * Returns an array of which row numbers are free to place a new number in.
 * @memberof twentyfourtyeight
 * @function
 * @param {twentyfourtyeight.Board} board The board to check for free columns.
 * @returns {number[]} An array of column indices of free columns.
 */
 twentyfourtyeight.free_rows = R.pipe(
    R.addIndex(R.map)((rows, index) => (
        R.includes(0, rows)
        ? index
        : -1
    )),
    R.reject(R.equals(-1))
);

// need to change this - game ends when there are no moves left
/**
 * Returns if the game has ended.
 * there are no moves.
 * @memberof twentyfourtyeight
 * @function
 * @param {twentyfourtyeight.Board} board
 * @returns {boolean}
 */
twentyfourtyeight.is_ended = function (board){
    return (
        twentyfourtyeight.free_columns(board).length === 0 &&
        twentyfourtyeight.free_rows(board).length === 0 &&

        tiles.innerHTML !== 2048
    )
};



// adding numbers - .some escapes early if true so need to use forEach
twentyfourtyeight.adding_numbers = function (row){
    const add_neighbours = function (index, row){
        return R.update(index, (row[index])*2, row)
    };
    const change_to_zero = function (index, row){
        return R.update((index+1), 0, row)
    };
    row.forEach(function(row, index){
        if (row[index] !== 0 && row[index] === row[index+1]){
            row = change_to_zero(add_neighbours(row, index), index);
        }
    });
    return row;

};
//let added_number = combine(R.filter(x => x !== 0, row))
//let padding =  _.repeat(0, row.length - added_number.length)
//return _.concat(added_number, padding)
/**
 * Returns if the game has been won.
 * there is a 2048 tile.
 * @memberof twentyfourtyeight
 * @function
 * @param {twentyfourtyeight.Board} board
 * @param {twentyfourtyeight.tiles} tile
 * @returns {number} 2048
 */
twentyfourtyeight.player_has_won = function(board){
    return R.length(R.filter(tile=>tile === 2048, R.flatten(board))) !== 0
}

/**
 * Checks if there are available moves.
 * @memberof twentyfourtyeight
 * @function
 * @param {twentyfourtyeight.Board} board
 * @returns {number} Number of options
 */

twentyfourtyeight.plays_available = function(board){
    let moves = [move_left(board), move_right(board), move_up(board), move_down(board)]
    let options = R.map(R.compose(R.length, find_empty_tiles), moves)
    return R.sum(options) > 0
}


/**
 * ignoring an invalid move.
 * @memberof twentyfourtyeight
 * @function 
 * @param {twentyfourtyeight.board} board
 * @event keyCode
 * @returns {board}
 */

twentyfourtyeight.check_move = (board, keycode) => {
    let after_move = row.onkeydown([keycode](board));
    if (!R.equals(after_move, grid)) {
        return generate_tile(after_move);
    }
    return board;
}

/**
 * moving the tiles in different directions.
 * returns a new array/board.
 * @memberof twentyfourtyeight
 * @function
 * @param {twentyfourtyeight.board} 
 * @returns {board}
 */
twentyfourtyeight.move_left = board => board.map(shift)
twentyfourtyeight.move_right = board => moveLeft(board.map(R.reverse)).map(R.reverse)
twentyfourtyeight.move_up = board => R.transpose(moveLeft(R.transpose(board)))
twentyfourtyeight.move_down = board =>  R.transpose(moveRight(R.transpose(board)))

 /**
  * shifting numbers along the row when a play has been made. 
  * this ensures the numbers move, even when there are no plays.
  * @memberof twentyfourtyeight
  * @function
  * @param {twentyfourtyeight.board} 
  * @returns {board} made up of newly created rows
  */

 const shift = function (row){
    const remove_zeros = function (row){
        return R.filter(tile => tile !== 0, row);
    }
    let merge = remove_zeros(adding_numbers(remove_zeros(row)));
    let empty = R.repeat(0, row.length-merge.length);
    return R.concat(merge, empty)
 }

 /**
  * start game by placing a tile on the board.
  * @memberof twentyfourtyeight
  * @function
  */

twentyfourtyeight.start_game = function (){
    return choose_tile(choose_tile(R.repeat([0,0,0,0], 4)));
}

/**
 * Generating score
 * @memberof twentyfourtyeight
 * @function
 * @param {twentyfourtyeight.board} row
 * @returns {score}
 */
twentyfourtyeight.score = function(row){
    score = score
    row.forEach(function(row, index){
        score += row[index];
    })
    return score
};

//twentyfourtyeight.move = function(tile, row_index, board){
  //  if (twentyfourtyeight.check_move){

   // }
//}

export default Object.freeze(twentyfourtyeight);
