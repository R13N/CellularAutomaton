/**
 * Created by Rien on 20/05/2015.
 */

var automaton,
    timer,
    currentSpeed = 500,
    timePaused = true,
    contWidth,
    cellSize;

//Document ready
$(function(){
    initialize();
    $("#new").click(initialize);
    $("#forward").click(update);
    $("#play").click(play);
    $("#pause").click(pause);
    $("#speed-slow").click(function(){setSpeed(1000)});
    $("#speed-normal").click(function(){setSpeed(250)});
    $("#speed-fast").click(function(){setSpeed(50)});
    $("#speed-instant").click(function(){setSpeed(1)});
});

function initialize(){
    var h = parseInt($("#rows").val()),
        w = parseInt($("#cols").val()),
        spawn = parseInt($("#spawn").val()),
        sick = parseInt($("#sick").val()),
        divide = parseInt($("#divide").val()),
        time = parseInt($("#time").val()),
        infection = parseInt($("#infection").val());

    automaton = new Automaton(h,w, spawn, sick, divide, time, infection);
    automaton.initialize();
    update();
}


function updateCanvas(){
    var canvas = $("#display"),
        container = $("#displaycontainer"),
        ctx = canvas.get(0).getContext("2d"),
        i, j, cell;

    if(container.width() !== contWidth){
        resizeCanvas(container.width());
    }

    //Clear canvas
    ctx.clearRect(0, 0, canvas.width(), canvas.height());

    for (i = 0; i < automaton.getWidth(); i += 1) {
        for (j = 0; j < automaton.getHeight(); j += 1) {
            cell = automaton.getCell(i,j);
            ctx.fillStyle = cell.color;
            ctx.fillRect(i*cellSize, j*cellSize, cellSize, cellSize);
        }
    }
}

function resizeCanvas(width){
    var canvas = $("#display");
    cellSize = Math.floor(width/automaton.getWidth());
    canvas.attr("width",automaton.getWidth()*cellSize);
    canvas.attr("height",automaton.getHeight()*cellSize);
}


function update() {
    var start = new Date().getTime();
    //updateView();
    updateCanvas();
    var inter = new Date().getTime();
    automaton.updateStatus();
    var stop = new Date().getTime();
    console.log("View:" + parseInt(inter - start));
    console.log("Model:" + parseInt(stop - inter));
}

function play(){
    if(timePaused){
        timePaused = false;
        $("#play").addClass("disabled");
        $("#pause").removeClass("disabled");
        timer = setInterval(update, currentSpeed);
    }

}

function pause(){
    if(!timePaused){
        timePaused = true;
        $("#pause").addClass("disabled");
        $("#play").removeClass("disabled");
        clearInterval(timer);
    }

}

function setSpeed(milis){
    currentSpeed = milis;
    if(!timePaused){
        clearInterval(timer);
        timer = setInterval(update, currentSpeed);
    }
}

