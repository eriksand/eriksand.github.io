var game = { // a container for all relevant GAME information
    
    player: {
        /*
        This is where we store player attributes
        */
        weapon: null,
        money: 0,
        kills: 0
    },
    
    canvas: {
        /*
        This is our "scene"
        */
        element: null,
        context: null,
    },
    
    elements: {
        /*
        Here we'll store stuff that appears on top of the scene
        */
        enemies: [],
        loot: null,
        allies: null
    },
    
    /*
    FUNCTIONS
    */
    Enemy: function(hrd, x, y, speed) {
        this.hitPoints = hrd;
        this.reward = hrd;
        this.damage = hrd;
        this.x = x;
        this.y = y;
        this.speed = speed;
    },
    
    init: function() {
        game.canvas = document.querySelector("canvas");
        game.canvas.context = game.canvas.getContext("2d");
        game.gameLoop();
        
    },
    
    /*
    Animation routines from http://incremental.barriereader.co.uk/one.html?v=15
    */
	gameRunning: null, //this is a new variable so we can pause/stop the game
	update: function() { //this is where our logic gets updated
        var random = Math.random();
		game.draw(random); //call the canvas draw function
	},
	draw: function(random) { //this is where we will draw all the information for the game!
        game.canvas.context.clearRect(0, 0, 500, 500);
        if (typeof game.elements.enemies == null) {
            game.elements.enemies = [];
        }
        if (random > 0.98) {
            var helper = new game.Enemy(1, 10, 100, 1);
            game.elements.enemies.push(helper);
        }
        for (var i = 0; i < game.elements.enemies.length; i++) {
            var helper = game.elements.enemies[i];
            game.canvas.context.fillRect(helper.x, helper.y, 5, 5);
            helper.x = helper.x + 0.5;
        }
		game.gameLoop(); //re-iterate back to gameloop
	},
	gameLoop: function() { //the gameloop function
		game.gameRunning = setTimeout(function() { 
			requestAnimFrame(game.update, game.canvas); 
		}, 10);
	}
};

/*
Helper
*/
window.requestAnimFrame = (function(){
	return window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame || 
		window.oRequestAnimationFrame || 
		window.msRequestAnimationFrame || 
	function (callback, element){
		fpsLoop = window.setTimeout(callback, 1000 / 60);
	};
}());

window.onload = game.init();


