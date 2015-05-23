/**
 * Created by Rien on 20/05/2015.
 */

function Automaton(h, w, spawn, sick, divide, ttl, infect){
    this.h = h;
    this.w = w;
    this.spawn = spawn/100;
    this.sick = sick/100;
    this.divide = divide/100;
    this.ttl = ttl;
    this.infect = infect/100;
    this.grid = [];
}

Automaton.prototype.getHeight = function(){
    return this.h;
};

Automaton.prototype.getWidth = function(){
    return this.w;
};

Automaton.prototype.getCell = function(x, y){
    return this.grid[x][y];
};

Automaton.prototype.getSurrounding = function(x, y){
    var i, j, found = [], dx, dy;
    for (i = -1; i < 2; i += 1) {
        for (j = -1; j < 2; j += 1) {
            dx = x + i;
            dy = y + j;
            if(!((i !== 0) && (j !== 0)) && dx >= 0 && dx < this.w && dy >= 0 && dy < this.h){
                found.push(this.grid[dx][dy]);
            }
        }
    }
    return found;
};

Automaton.prototype.initialize = function(){
    var i, j,
        grid = this.grid,
        chance = this.spawn,
        width = this.w,
        heigth = this.h;

    for (i = 0; i < width; i += 1) {
        grid[i] = [];
        for (j = 0; j < heigth; j += 1) {
            if(Math.random() < chance){
                grid[i][j] = new HealthyCell(i, j, this);
            } else {
                grid[i][j] = new EmptyCell(i, j);
            }
        }
    }
};

Automaton.prototype.updateStatus = function(){
    var i, j, newGrid;

    //Make a new grid
    newGrid = [];
    for (i = 0; i < this.getWidth(); i += 1) {
        newGrid[i] = [];
        for (j = 0; j < this.getHeight(); j += 1) {
            newGrid[i][j] = new EmptyCell(i,j);
        }
    }

    for (i = 0; i < this.getWidth(); i += 1) {
        for (j = 0; j < this.getHeight(); j += 1) {
            this.grid[i][j].step(newGrid);
        }
    }

    this.grid = newGrid;
};

function HealthyCell(x, y, automaton){
    this.automaton = automaton;
    this.type = "healthy";
    this.color = "rgb(0,200,0)";
    this.x = x;
    this.y = y;
}
HealthyCell.prototype.step = function(newGrid){

    if(automaton.sick > Math.random()){
        newGrid[this.x][this.y] = new SickCell(this.x, this.y, this.automaton)
    } else if(automaton.divide > Math.random()){

        this.divideCell(this.automaton.getSurrounding(this.x, this.y), newGrid);
    }

    if(newGrid[this.x][this.y].type === "empty"){
        newGrid[this.x][this.y] = this;
    }
};

HealthyCell.prototype.divideCell = function(surrounding, newGrid){
    var empty = [], i, newCell;
    for (i = 0; i < surrounding.length; i += 1) {
        if(surrounding[i].type === "empty"){
            empty.push(surrounding[i]);
        }
    }
    if(empty.length > 0){
        newCell = empty[Math.floor(Math.random()*empty.length)];
        newGrid[newCell.x][newCell.y] = new HealthyCell(newCell.x, newCell.y, this.automaton)
    }
};

function EmptyCell(x, y){
    this.x = x;
    this.y = y;
    this.type = "empty";
    this.color = "rgba(0,0,0,0)";
}

EmptyCell.prototype.step = function(){};

function SickCell(x, y, automaton){
    this.automaton = automaton;
    this.type = "sick";
    this.color = "rgb(200,0,0)";
    this.x = x;
    this.y = y;
    this.steps = 0;
}

SickCell.prototype.step = function(newGrid){
    var red, green;
    this.steps += 1;

    if( this.steps === automaton.ttl - 1){
        this.die(newGrid);
    } else {
        red = 255 - (this.steps/this.automaton.ttl)*150;
        green = 0;
        this.color = "rgb(" + parseInt(red, 10) + "," + parseInt(green, 10) + ",0)";
        newGrid[this.x][this.y] = this;
    }
};

SickCell.prototype.die = function(newGrid){
    var surrounding, i, newCell;
    newGrid[this.x][ this.y] = new DeadCell(this.x, this.y);
    surrounding = this.automaton.getSurrounding(this.x, this.y);
    for (i = 0; i < surrounding.length; i += 1) {
        newCell = surrounding[i];
        if(newCell.type === "healthy" && this.automaton.infect < Math.random()){
            newGrid[newCell.x][newCell.y] = new SickCell(newCell.x, newCell.y, this.automaton);
        }
    }
};

function DeadCell(x,y){
    this.x = x;
    this.y = y;
    this.color = "#000";
}

DeadCell.prototype.step = function(newGrid){
    newGrid[this.x][this.y] = new EmptyCell(this.x, this.y);
};