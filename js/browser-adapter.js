
export default class BrowserController{

    observers= [];

    constructor(){
        document.onkeydown = this._handleInput;
    }

    _handleInput = function(e){

        e = e || window.event;

        let directionChosen;
        switch(e.keyCode){
            case 38: directionChosen = "up"; break;
            case 40: directionChosen = "down"; break;
            case 37: directionChosen = "left"; break;
            case 39: directionChosen = "right"; break;
            default: return;
        }
        this._notify(directionChosen);
    }.bind(this);

    addObserver = function(observer){this.observers.push(observer);}

    _notify = function(input){this.observers.forEach( obs => obs.onInputEvent(input))}

}