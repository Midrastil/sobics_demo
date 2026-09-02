let game_area;
let ga_width, ga_height;

let char;
let blocks = [11]; //11*10es tomb

let start_ey = 0;
let end_ey = 900;
let offset_x = (end_ey - start_ey) / 10;
let char_width = offset_x, char_height;
let move_step = char_width;
let position;
let distans;
let block_in_hand_b = false;
let block_in_hand;
let block_type; //0 = mercur, 1 = venus, 2 = moon, 3 = mars, 4 = sun, 5 = asteroid
let score_point = 0;

let sound = new Audio("../audio/sound.mp3");


$(document).ready(function () {
    game_area = $('#gamearea');
    char = $('<img src="../img/char2.png" alt="astronaut" id="char">');
    ga_width = parseInt(game_area.css('width'));
    ga_height = parseInt(game_area.css('height'));

    game_area.append(char);

    char.on('load', function () {
        init_char();
        init_block();
    });


    $(window).on('keydown', move_char);

    $(window).on('keydown', pick_up);

    $(window).on('keydown', put_back);

    $('#score_board').on('click',score);

});

function pick_up(ev) {
    if (block_in_hand_b === false) {
        if (ev.keyCode === 32) {
            let lastRow = 0;
            for (let ind = 0; ind < 10; ind++) {
                if (blocks[ind][position] === undefined) {
                    break;
                } else {
                    lastRow = ind;
                }
            }
            let block = blocks[lastRow][position];
            let blocktype = blocks[lastRow][position].data("blockType");
            if (blocktype != 4) {
                distans = 9 - lastRow;
                blocks[lastRow][position].css({
                    top: '+=' + 70 * distans
                });
                block_in_hand_b = true;
                block_in_hand = block;
                game_area.append(block_in_hand);
                blocks[lastRow][position] = undefined;
                sound.play();
            }
        }
    }
}


function same_type_around(row_ind,col_ind){
    let same_around = 0;
    if (right(row_ind,col_ind) !== undefined){
        same_around += right(row_ind,col_ind);
    }
    if (left(row_ind,col_ind) !== undefined){
        same_around += left(row_ind,col_ind);
    }
    if (upper(row_ind,col_ind) !== undefined){
        same_around += upper(row_ind,col_ind);
    }
    if (under(row_ind,col_ind) !== undefined){
        same_around += under(row_ind,col_ind);
    }
    return same_around;
}

function left(row_ind, col_ind){
    block_type = blocks[row_ind][col_ind].data('blockType');
    if (blocks[row_ind][col_ind - 1] !== undefined){
        let left_type = blocks[row_ind][col_ind - 1].data('blockType');
        if (block_type === left_type){
            return 1;
        }
        return 0;
    }
}

function right(row_ind, col_ind) {
    block_type = blocks[row_ind][col_ind].data('blockType');
    if (blocks[row_ind][col_ind + 1] !== undefined) {
        let right_type = blocks[row_ind][col_ind + 1].data('blockType');
        if (block_type === right_type) {
            return 1;
        }
        return 0;
    }
}

function upper(row_ind, col_ind){
    block_type = blocks[row_ind][col_ind].data('blockType');
    if (blocks[row_ind + 1][col_ind] !== undefined) {
        let upper_type = blocks[row_ind + 1][col_ind].data('blockType');
        if (block_type === upper_type) {
            return 1;
        }
        return 0;
    }
}

function under(row_ind, col_ind){
    block_type = blocks[row_ind][col_ind].data('blockType');
    if (blocks[row_ind - 1][col_ind] !== undefined) {
        let under_type = blocks[row_ind - 1][col_ind].data('blockType');
        if (block_type === under_type) {
            return 1;
        }
        return 0;
    }
}

function score() {
    // bekerjuk a jatekos nevet a toplistahoz
    var person = prompt("Type a name:", "anonymus");
    // eltaroljuk localStorage-ben az aktualis jatekos klikkeleseinek szamat
    localStorage.setItem(person,score_point);

    // feltoltjuk a toplistat
    fill_toplist();

}


function fill_toplist() {
    // vegigmegyunk a localStorage mentett elemein es egy uj tombbe pakoljuk. asszociativ tomb
    var data = [];
    for (var i = 0; i < localStorage.length; i++) {
        data[i] = [localStorage.key(i), parseInt(localStorage.getItem(localStorage.key(i)))];
    }
    // csokkeno sorrendbe rendezzuk az elemeket az elert pontszam alapjan
    data.sort(function (a, b) {
        return b[1] - a[1];
    });
    // a 10 legtobb pontot elert jatekost jelezzuk ki a listan
    for (let act_data of data.keys()) {
        if (act_data < 10 && data[act_data][0] !== "null") {
            $('#list').append(data[act_data][0] + ': ' + data[act_data][1] + '<br>');
            console.log(data[act_data][0] + ': ' + data[act_data][1]);
        }
    }
}

function put_back(ev) {
    if (ev.keyCode === 13) {
        if (block_in_hand_b === true) {
            let firtEmptyRow = 0;
            for (let ind = 0; ind < 10; ind++) {
                if (blocks[ind][position] === undefined) {
                    firtEmptyRow = ind;
                    break;
                }
            }

            let blocktype = block_in_hand.data("blockType")
            if (blocktype == 5) {
                for (let ind = 0; ind < firtEmptyRow; ind++) {
                    blocks[ind][position].addClass('empty');
                }
                for (let ind = 0; ind < firtEmptyRow; ind++) {
                    blocks[ind][position] = undefined;
                }
                block_in_hand.addClass('empty');
            } else {
                distans = 9 - firtEmptyRow;
                block_in_hand.css({
                    top: '-=' + 70 * distans
                });
                blocks[firtEmptyRow][position] = block_in_hand;
            }

            score_point += 100;
            block_in_hand_b = false;
            block_in_hand = undefined;
            sound.play();
            $('#my_score').text(score_point);
        }
    }
}

function init_block() {
    for (let ind = 0; ind < 11; ind++) {
        blocks[ind] = [];
        for (let jnd = 0; jnd < 10; jnd++) {
            if (ind < 4) {
                let randomN = Math.floor(Math.random() * 10);
                let block_elem = $('<div class="block"></div>');
                block_elem.css({
                    left: jnd * 90,
                    top: ind * 70,
                    width: offset_x,
                });
                switch (randomN) {
                    case 0:
                        block_elem.addClass('mercur');
                        block_elem.data("blockType", "0");
                        break;
                    case 1:
                        block_elem.addClass('mercur');
                        block_elem.data("blockType","0");
                        break;
                    case 2:
                        block_elem.addClass('venus');
                        block_elem.data("blockType","1");
                        break;
                    case 3:
                        block_elem.addClass('venus');
                        block_elem.data("blockType","1");
                        break;
                    case 4:
                        block_elem.addClass('moon');
                        block_elem.data("blockType","2");
                        break;
                    case 5:
                        block_elem.addClass('moon');
                        block_elem.data("blockType","2");
                        break;
                    case 6:
                        block_elem.addClass('mars');
                        block_elem.data("blockType","3");
                        break;
                    case 7:
                        block_elem.addClass('mars');
                        block_elem.data("blockType","3");
                        break;
                    case 8:
                        block_elem.addClass('sun');
                        block_elem.data("blockType","4");
                        break;
                    case 9:
                        block_elem.addClass('meteor');
                        block_elem.data("blockType","5");
                        break;
                }
                blocks[ind].push(block_elem);
                game_area.append(block_elem);
            }
            else{
                let block_elem = undefined;
                blocks[ind].push(block_elem);
                game_area.append(block_elem);
            }
        }
    }
}

function move_char(ev) {
    let pressed_key = ev.key;
    if (pressed_key === 'ArrowRight') {
        if (parseInt(char.css('left')) + char_width < ga_width) {
            char.animate({
                left: '+=' + move_step
            }, 1)
            if (block_in_hand_b === true) {
                block_in_hand.css({
                    left: '+=' + move_step
                })
            }
            position += 1;
        } else {
            char.animate({
                left: ga_width - char_width
            }, 1)
            if (block_in_hand_b === true) {
                block_in_hand.css({
                    left: ga_width - char_width
                })
            }
            position = 9;
        }
    } else if (pressed_key === 'ArrowLeft') {
        if (parseInt(char.css('left')) - move_step > 0) {
            char.animate({
                left: '-=' + move_step
            }, 1)
            if (block_in_hand_b === true) {
                block_in_hand.css({
                    left: '-=' + move_step
                })
            }
            position -= 1;
        } else {
            char.animate({
                left: 0
            }, 1)
            if (block_in_hand_b === true) {
                block_in_hand.css({
                    left: 0
                })
            }
            position = 0;
        }
    }
}

function init_char() {
    char_height = parseInt(char.css('height'));

    char.css({
        top:  char_height + 15,
        width: char_width,
    });
    position = 0;
}
