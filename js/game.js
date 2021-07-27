import GameView from "./view.js";
import GameModel from "./model.js";
import GameController from "./controller.js"
import HTMLAdapter from "./html-adapter.js";
import BrowserAdapter from "./browser-adapter.js";

import config from "./config.js";

const htmlAdapter = new HTMLAdapter(config.adapter);
config.view.adapter = htmlAdapter;

const view =  new GameView(config.view);
const game = new GameModel(config.game);

const browserAdapter= new BrowserAdapter();
const controller = new GameController(browserAdapter);
controller.connectTo(game);

game.addObserver(view);


view.init();

game.start();