

export default class GameController{

    _controlled;

    constructor(adapter){
        adapter.addObserver(this);
    }

    connectTo = function(game){this._controlled = game;}
    

    onInputEvent = function(input){
        this._controlled.setCurrentDirection(input);
    }

}