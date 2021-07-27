

export default class GameView {

    _observers = [];
    _adapter;
    _field;
    _stats;
    _endPopup;

    constructor(config) {
        this._field = new GameFieldView(config);
        this._stats = new GameStatsView(config);
        this._endPopup = new GameEndPopup(config);
        this._adapter = config.adapter;
        this._bindNotify(this._adapter);
        this._bindNotify(this._endPopup);
    }

    _bindNotify = function(observable){
        observable.notify = this._notify;
    }.bind(this);

    addObserver = function(observer){this._observers.push(observer);}

    _notify = function(value){
        this._observers.forEach(obs=>obs.onInputEvent(value));
    }.bind(this);

    _init = function(){
        this._closePopups();
        this._clean();
        this._field.drawBackground();
        this._field.drawBorders();
    }

    _closePopups = function(){
        this._endPopup.close();
    }

    _clean = function(){
        this._adapter.clean();
    }


    update = function(model){
        switch(model.getState()){
            case "ended": this._showEndPopup(); break;
            case "setup": this._init(); break;
            default: {
                this._field.update(model.getField());
                this._stats.update(model.getStats());
            }
        }
    }

    _showEndPopup = function(){
        this._endPopup.display();
    }


}

class GameStatsView{

    _lengthCount;
    _timer;

    _drawLengthCounterHandler;
    _drawCountwatchHandler;

    constructor(config){
        this._drawLengthCounterHandler = config.adapter.drawLengthCounter;
        this._drawCountwatchHandler = config.adapter.drawCountwatch;
    }

    update = function(stats){
        this._updateLengthCount(stats.length);
        this._updateCountWatch(stats.time);
    }

    _updateLengthCount = function(count){
        this._lengthCount = count;
        this._drawLengthCounterHandler(this._lengthCount)
    }

    _updateCountWatch = function(time){
        this._timer = time;
        this._drawCountwatchHandler(this._timer);
    }



}

class GameFieldView{

    field = {};

    _drwBackgroundHandler;

    constructor(config) {
        this.field.dim = config.fieldDim;
        this.field.height = config.size * 0.7;
        this.field.width = this.field.height
        this.field.cellDim = this.field.width / 10;
        this._drawBackgroundHandler = config.adapter.drawBackground;
        this.field.cells = this._initCells(this.field.dim);
        for(let i = 0; i<this.field.dim; i++){
            for(let j=0; j<this.field.dim; j++){
                this.field.cells[i][j] = new GameCellView(
                    this.field.cellDim, 
                    this.field.cellDim * i,
                    this.field.cellDim * j,
                    config);
            }
        }
    }

    _initCells = function(dim){
        const matrix = [];
        for(let i=0; i<dim; i++) {
            matrix[i] = [];
            for(let j=0; j<dim; j++) {
                matrix[i][j] = undefined;
            }
        }
        return matrix;
    }

    drawBorders = function(){
        this.field.cells.forEach(row => {
            row.forEach(cell => cell.drawBorders());
        });
    }

    drawBackground = function(){
        this._drawBackgroundHandler()
    }.bind(this);

    drawContent = function(){
        this.field.cells.forEach(row=>{
            row.forEach(cell => cell.drawContent());
        })
    }

    update = function(gameField){
        for(let i = 0; i<gameField.cells.length; i++){
            for(let j=0; j<gameField.cells[i].length; j++){
                this.field.cells[i][j].update(gameField.cells[i][j].getContent());
            }
        }
    }

}

class GameCellView{
    dim;
    x;
    y;

    _content;

    _drawBordersHandler;

    _drawSpriteHandler;

    _cleanContentHandler;

    constructor(dim, x, y, config){
        this.x = x;
        this.y = y;
        this.dim = dim;
        this._drawBordersHandler = config.adapter.drawRectBorders;
        this._drawSpriteHandler = config.adapter.drawSprite;
        this._cleanContentHandler = config.adapter.cleanContent;
    }

    drawBorders = function(){
        this._drawBordersHandler(this.x, this.y, this.dim, this.dim);
    }

    drawContent = function(){
        if(this._content) this._drawSpriteHandler(this._content, this.x, this.y, this.dim, this.dim);
        else this._cleanContentHandler( this.x, this.y, this.dim, this.dim);
    }

    update = function(newContent){
        this._content = newContent;
        this.drawContent();
    }
}

class GameEndPopup{


    _popupId;
    _adapter;

    constructor(config){
        this._popupId = config.endPopupId;
        this._adapter = config.adapter;
        this._setupListener();
    }

    display = function(){
        this._adapter.displayPopup(this._popupId);
    }

    _setupListener = function(){
        this._adapter.setupClickListener(this._popupId, this._onClickHandler);
    }

    _onClickHandler = function(){
        this.notify({"type":"newGame"});
    }.bind(this);

    close = function(){
        this._adapter.closePopup(this._popupId);
    }

}