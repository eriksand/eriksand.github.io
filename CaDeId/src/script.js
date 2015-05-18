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
        hp: 200,
        leftEdge: 800,
    },
    
    canvas: {
        /*
        This is our "scene"
        */
        element: null,
        context: null
    },
    
    elements: {
        /*
        Here we'll store stuff that appears on top of the scene
        */
        enemies: [],
        loot: 0,
        allies: []
    },
    
    /*
    FUNCTIONS
    */
    Enemy: function(type, x, y, speed, rgb) {
        this.hitPoints = type;
        this.reward = type;
        this.damage = type;
        this.speed = speed;
        this.rgb = rgb; //hex rgb value
        /*
        @Mike: The enemy attributes is now based on the type. Meaning that if type is 1,
        we will have an enemy with attributes = 1. The enemy size will now depend on the type param.
        In the future the size will depend on enemy sprites, I guess.
        For now an enemyType 1 will be 20 pixels wide and type 2 will be 40 pixels wide
        */
        this.enemyWidth = 20 * type;
        this.enemyHeight = 20 * type;
        /*
        Note that x and y don't work like in a normal Cartesian plane.
        Origin is in the top left of the canvas
        x+ is to the right
        y+ is DOWNWARD!
        */
        this.x = x - this.enemyWidth;
        this.y = y;
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
        game.elements.enemies = []; //init array
        game.canvas.addEventListener("click", game.checkIfHit, false);
        game.player.weapon = new game.player.Weapon("Paper planes", 1); //give the player a starting weapon
        game.load(); //check if there is data to load
        game.save(); //this initializes the save keys
        game.gameLoop(); //initialize gameLoop
    },
    
    checkIfHit: function() {
        /*
        This function checks if a player's click hits an enemy element
        */
        var mouseX = event.pageX - game.canvas.offsetLeft;
        /*
        event.pageX returns the distance from the left edge of the browser window
        in pixels. canvas.offsetLeft returns the distance between the left edge of
        the canvas and the left edge of the browser window. By subtracting the offset
        from the pageX we get the canvas' clicked x-coord.
        */
        var mouseY = event.pageY - game.canvas.offsetTop;
        game.elements.enemies.forEach(function(helper) {
            
            //this if block basically means if (click is within edges of element)
            if (mouseY > helper.y && mouseY < helper.y + helper.enemyHeight 
                && mouseX > helper.x && mouseX < helper.x + helper.enemyWidth) {
                    
                helper.hitPoints--;
            }
        });
    },
    
    spawnEnemy: function() {
        var random = Math.random();
        var helper;
        randomY = 375 + Math.floor(Math.random() * 60);
        if (random > 0.998) {
            helper = new game.Enemy(2, 0, randomY, 0.5, "#FF0000");
        } else if (random > 0.98) {
            helper = new game.Enemy(1, 0, randomY, 0.5, "#00FF00");
        }
        if (typeof helper !== "undefined") { //if an enemy wasn't generated, we don't put it in the array
            game.elements.enemies.push(helper); //clever, huh?
        }
    },
    
    drawEnemy: function(index) {
        var helper = game.elements.enemies[index];
        if (helper.OldEnoughToDespawn()) { //check if enemy is old enough to despawn
            game.elements.enemies.splice(index, 1); //if it is, remove it from array
        } else if (helper.hitPoints <= 0){
            //if the enemy has been killed by something other than timeout
            game.elements.enemies.splice(index, 1); //remove it from the array
            game.player.kills++; //add one to the player's kills
            game.player.loot += helper.reward; //give the appropriate reward to the player
        }
        else { //otherwise we draw and move it
            if (helper.x < (game.castle.leftEdge - helper.enemyWidth)) { //if enemy has reached the castle, it stops moving
                helper.x += helper.speed; //increment enemy x-position before loop
            }            
            game.canvas.context.fillStyle = helper.rgb; //set color of the box
            game.canvas.context.fillRect(helper.x, helper.y, helper.enemyWidth, helper.enemyHeight);
            game.canvas.context.strokeStyle = "#000000"; //black border for all enemies
            game.canvas.context.lineWidth = helper.enemyWidth / 20; //thicker borders for thicker enemies
            game.canvas.context.strokeRect(helper.x, helper.y, helper.enemyWidth, helper.enemyHeight); //draw the border
        }
    },
    
    load: function () {
        if (typeof localStorage["playerLoot"] === "undefined") { //if the key "playerLoot" is undefined,
            return;                                             //there is no local storage to load, so we return
        } else {
            game.player.loot = parseInt(localStorage.getItem("playerLoot")); //if there is load data, we update key values
            game.player.weapon = JSON.parse(localStorage.getItem("playerWeapon"));
            game.player.kills = localStorage.getItem("playerKills");
            //console.log("loaded"); //this was used for debugging
        }
    },
    save: function () {
        if (game.saveHelper.timer < 1000) { //setInterval didn't work, so I made my own function
            game.saveHelper.timer++; //if timer is less than 1000, we increment by one and exit the function
            return;
        } else {
            game.saveHelper.timer = 0; //if it's 1000 (or more) we reset the timer to 0 and continue
        }
        localStorage.setItem("playerLoot", parseInt(game.player.loot)); //save the information
        localStorage.setItem("playerWeapon", JSON.stringify(game.player.weapon));
        localStorage.setItem("playerKills", game.player.kills);
        //console.log("saved"); //used for debugging
    },
    saveHelper: {
        timer: 1000 //the first value we assign to the timer is 1000 so we immediately get a localStorage active.
    },
    reset: function () {
        localStorage.clear(); //pretty self-explanatory
    },
    
    /*
    Animation routines from http://incremental.barriereader.co.uk/one.html?v=15
    */
    gameRunning: null, //this is a new variable so we can pause/stop the game
    update: function() { //this is where our logic gets updated
    
        //this is where we update our table
        var table = document.getElementById("stats");
        stats.rows[1].cells[0].innerHTML = game.player.kills;
        stats.rows[1].cells[1].innerHTML = game.player.loot;
        stats.rows[1].cells[2].innerHTML = game.player.weapon.name;
        stats.rows[1].cells[3].innerHTML = game.player.weapon.damage;
        //table updated
        game.save();
        game.spawnEnemy();
        game.draw(); //call the canvas draw function
    },
    draw: function() { //this is where we will draw all the information for the game!
        game.canvas.context.clearRect(0, 0, 1000, 500); //clear the canvas
        for (var i = 0; i < game.elements.enemies.length; i++) {
            /*
            This draws all enemies in the array
            */
            game.drawEnemy(i);
        }
        game.canvas.context.fillStyle = "#DDDDDD"; //make the castle light grey
        game.canvas.context.fillRect(game.castle.leftEdge, 230, 150, 250); //draw the castle
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
