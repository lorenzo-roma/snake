import GameView from "./view.js";
import GameModel from "./model.js";
import GameController from "./controller.js"
import BrowserAdapter from "./browser-adapter.js";
import config from "./config.js";

const browserAdapter = new BrowserAdapter(config.adapter);
config.view.adapter = browserAdapter;

const view =  new GameView(config.view);
const game = new GameModel(config.game);
const controller = new GameController();

game.addObserver(view);
view.addObserver(controller);
controller.connectTo(game);

controller.startNewGame();