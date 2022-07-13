import twentyfourtyeight from "./common/2048.js";
import R from "./common/ramda.js";

const DISPLAY_MODE = "to_string";
const display_functions = {
    "json": JSON.stringify,
};
const display_board = function (board) {
    try {
        return "\n" + display_functions[DISPLAY_MODE](board);
    } catch (ignore) {
        return "\n" + JSON.stringify(board);
    }
};

/** 
 * Returns if the board is in a valid state.
 * A board is deemed valid if:
 * - It is a square 2D array, containing only the defined elements.
 * - The elements the board can contain are the possible game tiles.
 * - Since the configuration of the tiles on the board is random,
 * placement will not be tested.
 * @memberof 2048.test
 * @function
 * @param {Board} board The board to test.
 * @param {Board} row The rows to test.
 * @throws if the board fails any of the above conditions.
 */


const throw_if_invalid = function(board){
    if (!Array.isArray(board) || !Array.isArray(board[0])){
        throw new Error(
            "The board is not a 2D array: " +display_board(board)
        );
    }
    const height = board[0].length;
    const square = R.all(
        (column) => column.length === height,
        board
    );
    if (!square){
        throw new Error(
            "The board is not square: " + display_board(board)
        );
    }

    const tiles_or_empty = [0, 2, 4,8, 32, 64, 128, 256, 512, 1024, 2048];
    const contains_valid_tiles = R.pipe(
        R.flatten,
        R.all((slot) => tiles_or_empty.inclused(slot))
    )(board);
    if (!contains_valid_tiles){
        throw new Error(
            "The board contains invalid numbers: " + display_board(board)
        );
    }

};

// An empty start board is tested to check validity.
// Features of a start board inclue:
// - The board is valid.
// - Playable board/not ended.
// - Start has not been triggered, so rows should be empty.
// - The board is not definied as won.
describe("Empty Board", function() {
    it("An empty board is valid", function() {
        const empty_board = twentyfourtyeight.empty_board();
        throw_if_invalid(empty_board);
    });

    it("An empty board has not ended.", function() {
        const empty_board = twentyfourtyeight.empty_board();
        if (twentyfourtyeight.is_ended(empty_board)) {
            throw new Error(
                "An empty board should not be ended: " + 
                display_board(empty_board)
            );
        }
    });

    it("An empty board has all free rows.", function() {
        const empty_board = twentyfourtyeight.empty_board();
        const all_empty_tiles = R.pipe(
            R.flatten,
            R.all(R.equals(0))
        )(empty_board);
        if(!all_empty_tiles) {
            throw new Error(
                "The empty board already has tiles: " +
                display_board(empty_board)
            );
        }
    });

    it("An empty board has not been won", function() {
        const empty_board = twentyfourtyeight.empty_board();
        const win = twentyfourtyeight.player_has_won()
        if (win){
            throw new Error(
                "The game has been won: " +
                display_board(empty_board)
            );
        }
    });
});


// starting playable board has a 2

// mid game - doesnt end, no 2048, 

/**
 * This function checks if the board has ended.
 * It will throw if 2048 is present, with or without free tiles,
 * And the board is still not ending.
 * It will also throw if the board is full.
 * However, if it is full with a 2048 tile, the game has been won.
 * @memberof 2048.test
 * @function
 * @param {Board} ended_board The final state of the board
 * @throws If the board does not pass through the test
 */
const throw_if_not_ending = function (ended_board){
    if (!twentyfourtyeight.is_ended(ended_board) &&
    (!twentyfourtyeight.plays_available(ended_board))){
        throw new Error (
            "An ended board is not being reported as ended: " +
            display_board(ended_board)
        );
    }
};

describe("Ended boards", function(){
    it("A board with no free tiles should end the game", function(){
        const ended_board = [
            [
                [2,4,2,4],
                [4,2,4,2],
                [2,4,2,4],
                [4,2,4,2]
            ]
        ];
        ended_board.forEach(throw_if_not_ending);
    });

    it(
        "A board with a 2048 tile should end the game",
        function(){
            const win = [
                [2,4,2,4],
                [8,16,512,2],
                [0,32,2048,0],
                [2,0,64,8]
            ];
            if(!twentyfourtyeight.in_ended(win) &&
            !twentyfourtyeight.player_has_won(win)){
                throw new Error (
                    `A winning tile is present, the board should be marked
                     as won:
                     ${display_board(win)}`);
            }
        }
    );
});