{"filter":false,"title":"Preloader.js","tooltip":"/public/javascripts/Preloader.js","undoManager":{"stack":[[{"start":{"row":12,"column":23},"end":{"row":31,"column":2},"action":"remove","lines":["","","\t\t//\tThese are the assets we loaded in Boot.js","\t\t//\tA nice sparkly background and a loading progress bar","\t\t//this.background = this.add.sprite(0, 0, 'preloaderBackground');","\t\t//this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');","","\t\t//\tThis sets the preloadBar sprite as a loader sprite.","\t\t//\tWhat that does is automatically crop the sprite from 0 to full-width","\t\t//\tas the files below are loaded in.","\t\t//this.load.setPreloadSprite(this.preloadBar);","","\t\t//\tHere we load the rest of the assets our game needs.","\t\t//\tAs this is just a Project Template I've not provided these assets, swap them for your own.","\t\t//this.load.image('titlepage', 'images/title.jpg');","\t\t//this.load.atlas('playButton', 'images/play_button.png', 'images/play_button.json');","\t\t//this.load.audio('titleMusic', ['audio/main_menu.mp3']);","\t\t//this.load.bitmapFont('caslon', 'fonts/caslon.png', 'fonts/caslon.xml');","\t\t//\t+ lots of other required assets here","\t\t"],"id":713}],[{"start":{"row":62,"column":22},"end":{"row":79,"column":4},"action":"remove","lines":["","","\t\t//\tYou don't actually need to do this, but I find it gives a much smoother game experience.","\t\t//\tBasically it will wait for our audio file to be decoded before proceeding to the MainMenu.","\t\t//\tYou can jump right into the menu if you want and still play the music, but you'll have a few","\t\t//\tseconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu","\t\t//\tit's best to wait for it to decode here first, then carry on.","\t\t","\t\t//\tIf you don't have any music in your game then put the game.state.start line into the create function and delete","\t\t//\tthe update function completely.","\t\t","\t\t/*","\t\tif (this.cache.isSoundDecoded('titleMusic') && this.ready == false)","\t\t{","\t\t\tthis.ready = true;","\t\t\tthis.state.start('MainMenu');","\t\t}","\t\t*/"],"id":714}],[{"start":{"row":53,"column":22},"end":{"row":59,"column":0},"action":"remove","lines":["","","\t\t//\tOnce the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes","\t\t","\t\t","\t\t//this.preloadBar.cropEnabled = false;",""],"id":715}],[{"start":{"row":59,"column":2},"end":{"row":61,"column":0},"action":"remove","lines":["","\t\t",""],"id":716}],[{"start":{"row":12,"column":20},"end":{"row":12,"column":21},"action":"insert","lines":["m"],"id":717}],[{"start":{"row":12,"column":21},"end":{"row":12,"column":22},"action":"insert","lines":["a"],"id":718}],[{"start":{"row":12,"column":22},"end":{"row":12,"column":23},"action":"insert","lines":["p"],"id":719}],[{"start":{"row":12,"column":23},"end":{"row":12,"column":24},"action":"insert","lines":["n"],"id":720}],[{"start":{"row":12,"column":24},"end":{"row":12,"column":25},"action":"insert","lines":["a"],"id":721}],[{"start":{"row":12,"column":25},"end":{"row":12,"column":26},"action":"insert","lines":["m"],"id":722}],[{"start":{"row":12,"column":26},"end":{"row":12,"column":27},"action":"insert","lines":["e"],"id":723}],[{"start":{"row":14,"column":27},"end":{"row":14,"column":68},"action":"remove","lines":["'assets/tilemaps/maps/features_test.json'"],"id":725}],[{"start":{"row":14,"column":27},"end":{"row":14,"column":28},"action":"insert","lines":["m"],"id":726}],[{"start":{"row":14,"column":28},"end":{"row":14,"column":29},"action":"insert","lines":["a"],"id":727}],[{"start":{"row":14,"column":29},"end":{"row":14,"column":30},"action":"insert","lines":["p"],"id":728}],[{"start":{"row":14,"column":30},"end":{"row":14,"column":31},"action":"insert","lines":["n"],"id":729}],[{"start":{"row":14,"column":31},"end":{"row":14,"column":32},"action":"insert","lines":["a"],"id":730}],[{"start":{"row":14,"column":32},"end":{"row":14,"column":33},"action":"insert","lines":["m"],"id":731}],[{"start":{"row":14,"column":33},"end":{"row":14,"column":34},"action":"insert","lines":["e"],"id":732}],[{"start":{"row":12,"column":20},"end":{"row":12,"column":27},"action":"remove","lines":["mapname"],"id":733}],[{"start":{"row":0,"column":0},"end":{"row":1,"column":0},"action":"insert","lines":["",""],"id":734}],[{"start":{"row":0,"column":0},"end":{"row":0,"column":1},"action":"insert","lines":["v"],"id":735}],[{"start":{"row":0,"column":1},"end":{"row":0,"column":2},"action":"insert","lines":["a"],"id":736}],[{"start":{"row":0,"column":2},"end":{"row":0,"column":3},"action":"insert","lines":["r"],"id":737}],[{"start":{"row":0,"column":3},"end":{"row":0,"column":4},"action":"insert","lines":[" "],"id":738}],[{"start":{"row":0,"column":4},"end":{"row":0,"column":5},"action":"insert","lines":["n"],"id":739}],[{"start":{"row":0,"column":5},"end":{"row":0,"column":6},"action":"insert","lines":["a"],"id":740}],[{"start":{"row":0,"column":6},"end":{"row":0,"column":7},"action":"insert","lines":["m"],"id":741}],[{"start":{"row":0,"column":7},"end":{"row":0,"column":8},"action":"insert","lines":["e"],"id":742}],[{"start":{"row":0,"column":7},"end":{"row":0,"column":8},"action":"remove","lines":["e"],"id":743}],[{"start":{"row":0,"column":6},"end":{"row":0,"column":7},"action":"remove","lines":["m"],"id":744}],[{"start":{"row":0,"column":5},"end":{"row":0,"column":6},"action":"remove","lines":["a"],"id":745}],[{"start":{"row":0,"column":4},"end":{"row":0,"column":5},"action":"remove","lines":["n"],"id":746}],[{"start":{"row":0,"column":4},"end":{"row":0,"column":5},"action":"insert","lines":["p"],"id":747}],[{"start":{"row":0,"column":4},"end":{"row":0,"column":5},"action":"remove","lines":["p"],"id":748}],[{"start":{"row":0,"column":4},"end":{"row":0,"column":5},"action":"insert","lines":["m"],"id":749}],[{"start":{"row":0,"column":5},"end":{"row":0,"column":6},"action":"insert","lines":["a"],"id":750}],[{"start":{"row":0,"column":6},"end":{"row":0,"column":7},"action":"insert","lines":["p"],"id":751}],[{"start":{"row":0,"column":7},"end":{"row":0,"column":8},"action":"insert","lines":["n"],"id":752}],[{"start":{"row":0,"column":8},"end":{"row":0,"column":9},"action":"insert","lines":["a"],"id":753}],[{"start":{"row":0,"column":9},"end":{"row":0,"column":10},"action":"insert","lines":["m"],"id":754}],[{"start":{"row":0,"column":10},"end":{"row":0,"column":11},"action":"insert","lines":["e"],"id":755}],[{"start":{"row":0,"column":11},"end":{"row":0,"column":12},"action":"insert","lines":["="],"id":756}],[{"start":{"row":0,"column":12},"end":{"row":0,"column":53},"action":"insert","lines":["'assets/tilemaps/maps/features_test.json'"],"id":757}],[{"start":{"row":0,"column":53},"end":{"row":0,"column":54},"action":"insert","lines":[";"],"id":758}]],"mark":44,"position":44},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":0,"column":54},"end":{"row":0,"column":54},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":136,"mode":"ace/mode/javascript"}},"timestamp":1431413428000,"hash":"b307679e7340ca9bd384e854e017c3f4b19b824c"}