

export default class GameController{

    _controlled;

    constructor(){
    }

    connectTo = function(game){this._controlled = game;}
    

    onInputEvent = function(input){
        switch(input.type){
            case "direction": this._changeDirection(input.value); break;
            case "newGame": this.startNewGame(); break;
        }
    }

    startNewGame = function(){
        this._controlled.init();
        this._controlled.start();
    };

    _changeDirection = function(newDirection){
        if(this._isNotOpposite(newDirection)){
            this._controlled.setCurrentDirection(newDirection);
        }
    }

    _isNotOpposite = function(direction){
        const snakeDirection = this._controlled.getCurrentDirection();
        switch(direction){
            case "down": return snakeDirection != "up";
            case "up": return snakeDirection != "down";
            case "left": return snakeDirection != "right";
            case "right": return snakeDirection != "left";
        }
    }

}