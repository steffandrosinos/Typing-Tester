var timer;
var timer_start = true;
var mseconds = 0;
var word_index = 0;
var correct = 0;
var incorrect = 0;
var text;
var best_score = -1;

$(function () {
    getText();
    updateBestScore();
});

function getText() {
    var rand = Math.floor((Math.random() * 61));
    text = texts[rand];
    $("#text").html(getTextDiv());
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

function updateSentence(correct, index) {
    if (correct) {
        var id = "#text_" + index;
        $(id).css("color", "#555");
    } else {
        var id = "#text_" + index;
        $(id).css("color", "#FF2222");
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

        default:
            //do nothing
            break;
    }

})

//Keep focusing the terminal input
loop = setInterval(function () {
    $("#input").focus();
}, 50);
