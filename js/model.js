

export default class GameModel {

    _field = {};
    _snake = {};

    _timer;
    _startTime;
    _state;

    _speed;

    _currentDirection = "left";

    _observers = [];

    constructor(config) {
        this._speed = config.speed;
        this._state = "setup";
        this._field.cells = this._initCells(config.fieldDim);
        for (let i = 0; i < config.fieldDim; i++) {
            for (let j = 0; j < config.fieldDim; j++) {
                this._field.cells[i][j] = new Cell(i, j);
            }
        }
        this._snake = new Snake();
    }

    addObserver = (observer) => this._observers.push(observer);

    setCurrentDirection = (value) =>this._currentDirection = value;

    _notify = ()=>this._observers.forEach(observer=>observer.update(this));

    _initCells = function (dim) {
        const matrix = [];
        for (let i = 0; i < dim; i++) {
            matrix[i] = [];
            for (let j = 0; j < dim; j++) {
                matrix[i][j] = undefined;
            }
        }
        return matrix;
    }

    start = function(){
        this._state = "started";
        this._startingSpawn();
        this._startTimer();
    }

    getState = ()=>this._state;

    getField = ()=> this._field;

    getStats = function(){
        return {
            "length": this._snake.cells.length,
            "time": new Date().getTime() - this._startTime
        };
    };


    _startingSpawn = function(){
        this._spawnSnake();
        this._spawnFood(3);
        this._notify();
    }.bind(this);

    _startTimer = function(){
        this._startTime = new Date().getTime();
        this._timer = setInterval(()=>this._moveSnake(), this._speed);
    }

    _spawnSnake = function(){
        const randomPosition = this._getRandomPosition();
        this._snake.spawn(this._field.cells[randomPosition.x][randomPosition.y]);
    }

    _getRandomPosition = function(){
        const x = Math.floor(Math.random() * this._field.cells.length);
        const y = Math.floor(Math.random() * this._field.cells.length);
        return {x: x, y: y};
    }

    _spawnFood = function(count){
        for(let i = 0; i<count; i++){
            let randomPosition;
            do{
                randomPosition = this._getRandomPosition();
            } while(!this._isPositionAvailable(randomPosition));
    
            this._field.cells[randomPosition.x][randomPosition.y].putFood();
        }
    }

    _isPositionAvailable = function(position){
        return this._field.cells[position.x][position.y].getContent() == null;
    }

    _isPresentFood = function(position){
        return this._field.cells[position.x][position.y].getContent() =="food";
    }

    _isPresentSnake = function(position){
        return this._field.cells[position.x][position.y].getContent() =="snake";
    }

    _moveSnake = function(){
        const nextPosition = this._getNextSnakePosition();
        const nextCell = this._field.cells[nextPosition.x][nextPosition.y];
        if(this._isPresentSnake(nextPosition)){
            this._end();
            return;
        }
        if(this._isPositionAvailable(nextPosition)){
            this._snake.moveTo(nextCell);
            this._notify();
        }
        if(this._isPresentFood(nextPosition)){
            this._snake.eatIn(nextCell);
            this._spawnFood(1);
            this._notify();
        }

    }

    _getNextSnakePosition = function(){
        let {x, y} = this._snake.getHeadPosition();

        switch(this._currentDirection){
            case "left": x -= 1; break;
            case "right": x+= 1; break;
            case "down": y+= 1; break;
            case "up": y-= 1; break;
        }
        
        if(x < 0 ) x = this._field.cells.length - 1;
        if(x > this._field.cells.length - 1) x = 0;
        if(y < 0 ) y = this._field.cells.length - 1;
        if(y > this._field.cells.length - 1) y = 0;
        return {x: x, y: y};
    }

    _end = function(){
        clearInterval(this._timer);
        this._state = "ended";
       this. _notify();
    }

 
}


class Cell {

    _content;
    _position;

    constructor(x, y){
        this._position = {x: x, y: y};
    }

    putSnake = () => this._content = "snake";
    putFood = () => this._content = "food";
    clear = () => this._content = null;


    getContent = () => this._content;
    getPosition = () => this._position;

}

class Snake{

    cells = [];

    constructor(){}

    spawn = function(cell){
        cell.putSnake();
        this.cells.push(cell);
    }

    getHeadPosition = function(){
        return this.cells[this.cells.length-1].getPosition();
    }

    moveTo = function(cell){
        cell.putSnake();
        this.cells[0].clear();
        this.cells.shift();
        this.cells.push(cell);
    }

    eatIn = function(cell){
        cell.putSnake();
        this.cells.push(cell);
    }

}