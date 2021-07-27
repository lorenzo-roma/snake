
export default class BrowserAdapter {
    padding; 
    context;
    offset;
    lengthPanel;
    timerPanel;
    hideClass;
    canvasWidth;
    canvasHeght;

    constructor(options){
        const canvas = document.getElementById(options.canvasId);
        this.lengthPanel = document.getElementById(options.lengthPanelId);
        this.timerPanel = document.getElementById(options.timerPanelId);
        this.context = canvas.getContext("2d");
        this.context.lineWidth = options.lineStroke;
        this.context.strokeStyle = options.gridColor;
        this.context.fillStyle = options.canvasBackgroundColor;
        this.padding = options.gridPadding;
        this.offset = options.gridOffset;
        this.hideClass = options.hideClass;
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
        document.onkeydown = this._handleInput;
    }


    setupClickListener = function(id, callback){
        document.getElementById(id).addEventListener("click", callback);
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
        this.notify({type: "direction", value:directionChosen});
    }.bind(this);

    
    addObserver = function(observer){this.observers.push(observer);}

    notify = function(){}


    drawRectBorders = function(x, y, w, h){
        x=parseInt(x) + 0.5 + this.offset;
        y=parseInt(y) + 0.5 + this.offset;
        w=parseInt(w) * (1 - this.padding);
        h=parseInt(h) * (1 - this.padding);
        this.context.strokeRect(x,y,w,h);
    }.bind(this);

    drawBackground = function(){
        const w=parseInt(this.canvasWidth);
        const h=parseInt(this.canvasHeight);
        this.context.fillRect(0.5, 0.5, w, h );
    }.bind(this);
     

    drawSprite = function(content, x, y, w, h){
        const path =this._getImagePath(content);
        let image = new Image();
        image.onload = function()
        {

            w=parseInt(w) * (1 - this.padding * 5);
            h=parseInt(h) * (1 - this.padding * 5);
            x=parseInt(x) + 0.5 + w / 2;
            y=parseInt(y) + 0.5 + h / 2;+
            this.context.clearRect(x, y, w, h);
            this.context.drawImage(image, x,y,w,h);
        }.bind(this);
        image.src = path;
    }.bind(this);

    cleanContent = function(x, y, w, h){
        w=parseInt(w) * (1 - this.padding * 5);
        h=parseInt(h) * (1 - this.padding * 5);
        x=parseInt(x) + 0.5 + w / 2;
        y=parseInt(y) + 0.5 + h / 2;
        this.context.clearRect(x, y, w, h);
    }.bind(this);

    drawLengthCounter = function(count){
        this.lengthPanel.innerHTML = count;
    }.bind(this);

    drawCountwatch = function(time){
        const minutes = Math.floor(time / 60000);
        const seconds = ((time % 60000) / 1000).toFixed(0);
        this.timerPanel.innerHTML = minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }.bind(this);

    displayPopup = function(id){
        const popup = document.getElementById(id);
        popup.classList.remove(this.hideClass);
    }.bind(this);

    closePopup = function(id){
        const popup = document.getElementById(id);
        popup.classList.add(this.hideClass);
    }.bind(this);

    clean = function(){
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }.bind(this);

    _getImagePath = function(content){
        switch(content){
            case "food":  return "../assets/img/fruit.gif";
            case "snake": return "../assets/img/snake.png";
            default: return "../assets/img/clean.png";
        }
    }
}