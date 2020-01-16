var timer;
var timer_start = true;
var mseconds = 0;
var word_index = 0;
var correct = 0;
var incorrect = 0;
var text;
var best_score = -1;
var last_index = -1;
var char_count = -1;

$(function () {
    getText();
    updateBestScore();
    char_count = getCharecterCount();
    console.log("char count: " + char_count);
});

function getText() {
    var text_id = Math.floor((Math.random() * 62));
    text = texts[text_id];
    $("#text").html(getTextDiv());
    $("#text_id").html("<gr>id: <super>" + text_id + "</super></gr>");
}

function getTextDiv() {
    var html = "";
    for (var i = 0; i < text.length; i++) {
        html += "<div id='text_" + i + "' class='text'>" + text[i] + "</div>";
    }
    return html;
}

function checkSpelling(index, input) {
    if (text[index] == input) {
        return true;
    } else return false;
}

function getCharecterCount() {
    var count = 0;
    for (var i=0; i<text.length; i++) {
        count += text[i].length;
    }
    return count
}

function updateSentence(correct, index) {
    if (correct) {
        var id = "#text_" + index;
        $(id).css("color", "#555");
    } else {
        var id = "#text_" + index;
        $(id).css("color", "#FF2222");
    }
}

function updateProgress(word_index) {
    if (word_index != 0) {
        var percent_done = (word_index / text.length) * 100;
        var str = "" + percent_done.toFixed(0) + "%";
        $("#prog_val").css("width", str);
        $("#prog_show").css("left", str);
    } else {
        $("#prog_val").css("width", "0%");
        $("#prog_show").css("left", "0%");
    }
}

function printResults(wpm) {
    var html = $("#results").html();
    var result = "<div><gr>WPM:</gr> <strong>" + wpm.toFixed(2) + "</strong></div>" + html;
    $("#results").html(result);
    updateBestScore();
}

function updateBestScore() {
    best_score = localStorage['best_score'] || -1;
    if (best_score != -1) {
        var html = "<gr>Best:</gr> <strong>" + best_score + "</strong>";
        $("#best").html(html);
    } else {
        var html = "<gr>Best:</gr> <strong>--</strong>";
        $("#best").html(html);
    }
}

function reset() {
    //getText();
    timer_start = true;
    clearInterval(timer);
    mseconds = 0;
    word_index = 0;
    correct = 0;
    incorrect = 0;
    $("#est").html("<gr>Estimated WPM:</gr> <strong>--.--</strong>");
    $('#input').val("");
    for (var i = 0; i < text.length; i++) {
        var id = "#text_" + i;
        $(id).css("color", "#FFF");
    }
    $('#input').val("");
}

function resetProgress() {
    $("#prog_val").css("width", "0%");
    $("#prog_show").css("left", "0%");
}

$(document).keydown(function (e) {
    if (timer_start == true) {
        timer = setInterval(function () {
            mseconds += 10;
            if (word_index > 0) {
                var current_wpm = word_index / mseconds;
                var wpm = current_wpm * 60000;
                var html = "<gr>Estimated WPM:</gr> <strong>" + wpm.toFixed(2) + "</strong>";
            }
            $("#est").html(html);
        }, 10);
        timer_start = false;
        resetProgress();
    }

    switch (e.keyCode) {
        case 32: //space key
            e.preventDefault();

            var spelling = checkSpelling(word_index, $('#input').val());
            if (spelling == true) {
                updateSentence(spelling, word_index);
                word_index++;
                $('#input').val("");
            } else {
                updateSentence(spelling, word_index);
            }

            updateProgress(word_index);

            if (word_index == text.length) {
                var wpms = text.length / mseconds;
                var wpm = wpms * 60000;
                if (wpm > best_score) {
                    best_score = wpm;
                    localStorage['best_score'] = wpm.toFixed(2);
                }
                printResults(wpm);
                reset();
            }
            break;

        case 13:
            reset();
            resetProgress()
        default:
            //do nothing
            break;
    }

})

//Keep focusing the terminal input
loop = setInterval(function () {
    $("#input").focus();
}, 50);
