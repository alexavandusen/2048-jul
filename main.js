import twentyfourtyeight from "../common/2048.js";
import R from "./common/ramda.js";
import Json_rpc from "./Json_rpc.js";

// String literals.
const result_text = [
    "Congratulations! You have won the game.",
    "Sorry! You have lost."
];

// Methods:
const grid_display = document.querySelector("board");
const show_score = document.getElementById("score-container");
const result_dialog = document.getElementById("result_dialog");

const start_button = document.getElementById("start-button");
let board = twentyfourtyeight.empty_board();
let score = twentyfourtyeight.score();


const board_columns = 4;
const board_rows = 4;

document.documentElement.style.setProperty("--board-rows", board_rows);
document.documentElement.style.setProperty("--board-columns", board_columns);

//const board = document.getElementById("board");

const tile_slots = R.range(0, board_rows + 1).forEach(function (row_index) {
    const row = document.createElement("div");
    row.className = "row";
    row.tabIndex = 0;
    row.setAttribute("aria-label", `Row ${row_index}`);
    //grid =
    R.range(0, board_columns + 1).forEach(function () {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = 0;
        row.append(cell);
        return cell;
    });
    grid_display.append(row);

    const update_tile = function (){
        board = twentyfourtyeight.board();
        board.forEach(function (row, row_index) {
            row.forEach(function (tile, col_index) {
                const num = board[col_index][row_index];
                tile.innerText = num;
                tile.getElementById(`tile+${tile.innerText}`);
            });
            return board;
        });


        start_button.onclick = function (){
            board = twentyfourtyeight.empty_board();
            const free_tiles = twentyfourtyeight.find_empty_tiles(board);
            update_tile();
            twentyfourtyeight.score();
            return twentyfourtyeight.generate_tiles(board, free_tiles);
        };

        row.onkeydown = function (event) {
            if (event.keycode === 39){
                twentyfourtyeight.move_right();
                twentyfourtyeight.score();
            } else if (event.keycode === 37){
                twentyfourtyeight.move_left();
                twentyfourtyeight.score();
            } else if (event.keycode === 38) {
                twentyfourtyeight.move_up();
                twentyfourtyeight.score();
            } else if (event.keycode === 40) {
                twentyfourtyeight.move_down();
                twentyfourtyeight.score();
            }
        };
        //board.append(row);
        update_tile();

        row.onkeydown = function (){
            let result;
            if (twentyfourtyeight.is_ended(board) &&
            !twentyfourtyeight.player_has_won(board)){
                result = 2;
                document.getElementById("result_message").textContent(
                    result_text[result]);
            } else if ((twentyfourtyeight.is_ended(board) &&
            twentyfourtyeight.player_has_won(board)) ||
            twentyfourtyeight.player_has_won(board)){
                result = 1;
                document.getElementById("result_message").textContent(
                    result_text[result]);
            }
            result_dialog.showModal();
        };

    };

});

const draw_board = function (){
    tile_slots.forEach(function(r, row_index){
        r.forEach(function(cell, column_index){
            const tile = board[row_index][column_index];
            cell.innerText = tile;
            // want to change the cell to the numbered tile
        });
    });
};

result_dialog.onclick = function(){
    board = twentyfourtyeight.empty_board();
    score = twentyfourtyeight.score();
    result_dialog.close();
};
result_dialog.onkeydown = result_dialog.onclick;

board.firstChild.focus();
draw_board();