var game = { // a container for all relevant GAME information
    
    player: {
        /*
        This is where we store player attributes
        */
        weapon: null,
        money: 0,
        kills: 0,
        
        Weapon: function(name, dmg, price) {
            this.name = name;
            this.dmg = dmg;
            this.price = price;
        }
    },
    
    castle: {
        /*
        Here we store castle-related attributes
        */
        hp: 0
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
        allies: []
    },
    
    /*
    FUNCTIONS
    */
    Enemy: function(hrd, x, y, speed) {
        this.hitPoints = hrd;
        this.reward = hrd;
        this.damage = hrd;
        /*
        Note that x and y don't work like in a normal Cartesian plane.
        Origin is in the top left of the canvas
        x+ is to the right
        y+ is DOWNWARD!
        */
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.whenSpawned = Math.floor(Date.now() / 1000); //log when the instance was created, in seconds
        this.OldEnoughToDespawn = function() { //return true if the enemy is more than five minutes old
            if ((Math.floor(Date.now() / 1000) - this.whenSpawned) > 5 * 60) {
                return true;
            } else {
                return false;
            }
        };
        
    },
    
    Ally: function(name, dmg, price) {
        /*
        Store attributes related to allies
        */
        this.name = name;
        this.dmg = dmg;
        this.price = price;
    },
    
    init: function() {
        /*
        Initialize the game
        */
        game.canvas = document.querySelector("canvas"); //assign canvas
        game.canvas.context = game.canvas.getContext("2d"); //assign context
        game.gameLoop(); //initialize gameLoop
        
    },
    
    /*
    Animation routines from http://incremental.barriereader.co.uk/one.html?v=15
    */
	gameRunning: null, //this is a new variable so we can pause/stop the game
	update: function() { //this is where our logic gets updated
        if (typeof game.elements.enemies == null) { //check if array is initialized
            game.elements.enemies = []; //if not, initialize
        }
        var random = Math.random();
        if (random > 0.98) { //chance of enemy spawning
            var helper = new game.Enemy(1, 10, 120, 1);
            game.elements.enemies.push(helper); //create and add new enemy to array
        }
		game.draw(); //call the canvas draw function
	},
	draw: function() { //this is where we will draw all the information for the game!
        game.canvas.context.clearRect(0, 0, 500, 500); //clear the canvas
        for (var i = 0; i < game.elements.enemies.length; i++) {
            /*
            This draws all enemies in the array
            */
            var helper = game.elements.enemies[i];
            if (helper.OldEnoughToDespawn()) { //check if enemy is old enough to despawn
                game.elements.enemies.splice(i, 1); //if it is, remove it from array
            } else { //otherwise we draw and move it
                if (helper.x < 234) { //if enemy has reached the castle, it stops moving
                    helper.x = helper.x + 0.5; //increment enemy x-position before loop
                }
                game.canvas.context.fillRect(helper.x, helper.y, 5, 5);
            }
        }
        game.canvas.context.fillStyle = "#DDDDDD"; //make the castle light grey
        game.canvas.context.fillRect(240, 80, 40, 60); //draw the castle
        game.canvas.context.fillStyle = "#000000"; //make enemies black
		game.gameLoop(); //re-iterate back to gameloop
	},
	gameLoop: function() { //the gameloop function
		game.gameRunning = setTimeout(function() { 
			requestAnimFrame(game.update, game.canvas); 
		}, 10);
	}
};

/*
Helper. I don't know why this works
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