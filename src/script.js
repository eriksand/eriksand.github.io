var game = { // a container for all relevant GAME information
    
    player: {
        /*
        This is where we store player attributes
        */
        weapon: null,
        loot: 0,
        kills: 0,
        
        Weapon: function(name, damage) {
            this.name = name;
            this.damage = damage;
        }
    },
    
    castle: {
        /*
        Here we store castle-related attributes
        */
        hp: 0,
        leftEdge: 800,
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
        @Erkki: The enemy type is based now based on the hrd. Meaning that if hrd is 1,
        we will have an enemy type 1. The enemy size will now depend on the enemyType.
        In the future the size will depend on enemy sprites, I guess.
        For now an enemyType 1 will be 5 pixels wide and type 2 will be 8 pixels wide
        */
        this.enemyType = hrd;
        
        var size;
        if (this.enemyType === 1) {
            size = 20;
        } else if (this.enemyType === 2) {
            size = 40;
        }
        this.enemyWidth = size;
        this.enemyHeight = size;
        /*
        Note that x and y don't work like in a normal Cartesian plane.
        Origin is in the top left of the canvas
        x+ is to the right
        y+ is DOWNWARD!
        */
        this.x = x - this.enemyWidth;
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
        game.elements.enemies = [];
        game.canvas.addEventListener("click", game.checkIfHit, false);
        game.player.weapon = new game.player.Weapon("Paper planes", 1);
        game.gameLoop(); //initialize gameLoop
    },
    
    checkIfHit: function() {
        var mouseX = event.pageX - game.canvas.offsetLeft;
        var mouseY = event.pageY - game.canvas.offsetTop;
        game.elements.enemies.forEach(function(helper) {
            if (mouseY > helper.y && mouseY < helper.y + helper.enemyHeight 
                && mouseX > helper.x && mouseX < helper.x + helper.enemyWidth) {
                    
                helper.hitPoints--;
            }
        });
    },
    
    /*
    Animation routines from http://incremental.barriereader.co.uk/one.html?v=15
    */
    gameRunning: null, //this is a new variable so we can pause/stop the game
    update: function() { //this is where our logic gets updated
        var table = document.getElementById("stats");
        stats.rows[1].cells[0].innerHTML = game.player.kills;
        stats.rows[1].cells[1].innerHTML = game.player.loot;
        stats.rows[1].cells[2].innerHTML = game.player.weapon.name;
        stats.rows[1].cells[3].innerHTML = game.player.weapon.damage;
        var random = Math.random();
        if (random > 0.998) { //chance of big enemy spawning
            var randomY = 375 + Math.floor(Math.random() * 60); //Random y-coordinate between 100 and 134ish
            var helper = new game.Enemy(2, 0, randomY, 0.5);
            game.elements.enemies.push(helper); //create and add new big enemy to array
        } else if (random > 0.98) { //chance of normal enemy spawning if big one wasn't spawned.
            // Technically that's not the actual chance, since a big enemy could have been spawned as well
            var randomY = 375 + Math.floor(Math.random() * 80); //random y-coordinate between 100 and 134ish
            var helper = new game.Enemy(1, 0, randomY, 0.5);
            game.elements.enemies.push(helper); //create and add new enemy to array
        }
        game.draw(); //call the canvas draw function
    },
    draw: function() { //this is where we will draw all the information for the game!
        game.canvas.context.clearRect(0, 0, 1000, 500); //clear the canvas
        for (var i = 0; i < game.elements.enemies.length; i++) {
            /*
            This draws all enemies in the array
            */
            var helper = game.elements.enemies[i];
            if (helper.OldEnoughToDespawn()) { //check if enemy is old enough to despawn
                game.elements.enemies.splice(i, 1); //if it is, remove it from array
            } else if (helper.hitPoints <= 0){
                game.elements.enemies.splice(i, 1);
                game.player.kills += 1;
                game.player.loot += helper.reward;
            }
            else { //otherwise we draw and move it
                if (helper.x < (game.castle.leftEdge - helper.enemyWidth)) { //if enemy has reached the castle, it stops moving
                    helper.x += helper.speed; //increment enemy x-position before loop
                }
                if (helper.enemyType === 1) {
                    game.canvas.context.fillRect(helper.x, helper.y, helper.enemyWidth, helper.enemyHeight);
                } else if (helper.enemyType === 2) {
                    game.canvas.context.fillRect(helper.x, helper.y, helper.enemyWidth, helper.enemyHeight);
                }
            }
        }
        game.canvas.context.fillStyle = "#DDDDDD"; //make the castle light grey
        game.canvas.context.fillRect(game.castle.leftEdge, 230, 150, 250); //draw the castle
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
