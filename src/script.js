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
        context: null
    },
    
    enemy: {
        /*
        This is where we store enemy attributes
        */
        hitPoints: 0,
        reward: 0,
        damage: 0,
        coordinates: null,
        speed: 0
    },
    
    
    /*
    FUNCTIONS
    */
    init: function() {
        game.canvas = document.querySelector("canvas");
        game.canvas.context = game.canvas.getContext("2d");
        
    },
    
    /*
    Animation routines from http://incremental.barriereader.co.uk/one.html?v=15
    */
	gameRunning: null, //this is a new variable so we can pause/stop the game
	update: function() { //this is where our logic gets updated
		game.draw(); //call the canvas draw function
	},
	draw: function() { //this is where we will draw all the information for the game!
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


