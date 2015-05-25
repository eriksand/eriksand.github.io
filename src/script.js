var game = { // a container for all relevant GAME information

    //date: null, //fps check

    sounds: {
        soundsOn: 1, //initial value = 1 = true
        toggle: function() {
            var helper = document.getElementsByTagName("button");
            if (game.sounds.soundsOn) { //if true
                game.sounds.soundsOn = 0; //set to false
                helper[0].innerHTML = "Turn sounds on";
            } else {
                game.sounds.soundsOn = 1; //set to true
                helper[0].innerHTML = "Turn sounds off";
            }
        }
    },
    
    player: {
        /*
        This is where we store player attributes
        */
        weapon: null,
        loot: 0,
        kills: 0,
        x: 810,
        y: 210        
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
        allies: [],
        projectiles: []
    },
    
    /*
    FUNCTIONS
    */
    Weapon: function(name, damage, speed, rate) {
        this.name = name;
        this.damage = damage;
        this.speed = speed;
        this.rate = rate;
        this.timer = 1000; //no need for cooldown for first firing
    },
    
    weaponCooldownHelper: function(weapon) {
        if (weapon.timer >= 1000) {
            weapon.timer = 0;
            return true;
        } else {
            return false;
        }
    },
    
    Projectile: function(target, weapon, origin) {
        /*
        target = mouseX and mouseY
        weapon is used to determine damage and projectile speed
        */
        this.target = target;
        this.speed = weapon.speed;
        this.startLoc = [origin.x, origin.y]; //set the origin of the projectile
        this.location = this.startLoc.slice(0); //set the first location of the projectile to origin
        this.rgb = "#FFFFFF"; //white. Paper planes, dude.
        
        this.getTarget = function(index) {
            return this.target[index]; //unnecessary, legacy code from fixed bug
        }
        this.getStartLoc = function(index) {
            return this.startLoc[index]; //unnecessary, legacy code from fixed bug
        }
    },
    
    
    Enemy: function(type, x, y, speed, rgb) {
        this.hitPoints = type;
        this.reward = type;
        this.damage = type;
        this.speed = speed;
        this.rgb = rgb; //hex rgb value
        /*
        @Mike: The enemy attributes are now based on the type. Meaning that if type is 1,
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
    
    Ally: function(name, dmg, price, weapon, x, y) {
        /*
        Store attributes related to allies
        */
        this.name = name;
        this.dmg = dmg;
        this.price = price;
        this.weapon = weapon;
        this.x = x;
        this.y = y;
    },
    /*
    @Erkki trying to create some AllyAI and Ally properties.
    I don't know how to organize it all. But I'll put some AI here.
    */
    updateAllyAI: function() {
        for (i = 0; i < game.elements.allies.length; i++) {
            var allyHelper = game.elements.allies[i];
            if (!game.weaponCooldownHelper(allyHelper.weapon)) {
            return; //if cooldown is not done, we don't spawn a new particle
            }
        var helper = new game.Projectile([200, 400], allyHelper.weapon, allyHelper); //create a new projectile
        game.elements.projectiles.push(helper); //add it to the array of projectiles
        }
        allyHelper.weapon.timer += ((allyHelper.weapon.rate * 1000) / 60); //cool down the player's weapon each tick
    },
    drawAllies: function() {
        for (i = 0; i < game.elements.allies.length; i++) {
            game.canvas.context.fillStyle = "#FE2EC8";
            game.canvas.context.fillRect( game.elements.allies[i].x , game.elements.allies[i].y, 10, 10 );
        }
    },
    
    init: function() {
        /*
        Initialize the game
        */
        game.canvas = document.querySelector("canvas"); //assign canvas
        game.canvas.context = game.canvas.getContext("2d"); //assign context
        game.elements.enemies = []; //init array
        //@Erkki init new Ally, maybe not the best way. Could add function addAlly();
        game.elements.allies = []; //init array?
        var allyWeaponHelper = new game.Weapon("Paper planes", 1, 3, 2);
        var allyHelper = new game.Ally("Lasse", 1, 500, allyWeaponHelper, 200, 100);
        game.elements.allies.push(allyHelper);// @Erkki added ally "Lasse" and coordinates 200, 100
        
        game.player.weapon = new game.Weapon("Paper planes", 1, 3, 2); //give the player a starting weapon
        game.canvas.addEventListener("click", game.readClick, false);
        game.load(); //check if there is data to load
        game.save(); //this initializes the save keys
        //game.date = new Date; //fps loop
        game.gameLoop(); //initialize gameLoop
        
    },
    
    readClick: function() {
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
        if (!game.weaponCooldownHelper(game.player.weapon)) {
            return; //if cooldown is not done, we don't spawn a new particle
        }
        var helper = new game.Projectile([mouseX, mouseY], game.player.weapon, game.player); //create a new projectile
        game.elements.projectiles.push(helper); //add it to the array of projectiles
        
    },
    
    // Play the audio file ouch.wav, path is in the index.html, the getElementById finds the element
    // in the html-file. In this case the audio file, and then we play it :) @Erkki
    playOuchSound: function() {
        if (game.sounds.soundsOn) {
            document.getElementById("audio/ouch.wav").play();
        }
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
    
    calculateProjectileProperties: function() {
        if (game.elements.projectiles.length === 0) { //if there are no projectiles
            return; //do nothing
        }
        for (var i = 0; i < game.elements.projectiles.length; i++) { //for each projectile
            var helper = game.elements.projectiles[i];
            if (helper.location[0] < 0 || helper.location[0] > 1000 || helper.location[1] < 0 || helper.location[1] > 500) {
                game.elements.projectiles.splice(i, 1); //if the projectile is off screen - remove it from the array
            } else {
                // Pythagoras all the way! Can't really put this in to words that easily
                var changeX = helper.getTarget(0) - helper.getStartLoc(0);
                var changeY = helper.getTarget(1) - helper.getStartLoc(1);
                if (changeX === 0 && changeY === 0){
                    //Do nothing
                } else {
                    var hypotenusa = Math.sqrt( changeX * changeX + changeY * changeY);
                    helper.location[0] += changeX * helper.speed / hypotenusa; //move the projectile x
                    helper.location[1] += changeY * helper.speed / hypotenusa; //move the projectile y
                }
                
            }
        }
        game.checkIfHit();
    },
    drawProjectile: function(index) {
        var helper = game.elements.projectiles[index];
        game.canvas.context.fillStyle = helper.rgb;
        game.canvas.context.fillRect(helper.location[0], helper.location[1], 2, 2);
    },
    checkIfHit: function() {
        for (var i = (game.elements.enemies.length - 1); i >= 0; i--) { //iterate from end of array to get "topmost" elements first
            var enemyHelper = game.elements.enemies[i];
            for (var a = 0; a < game.elements.projectiles.length; a++) { //for each projectile
                var projectileHelper = game.elements.projectiles[a];
                if (projectileHelper.location[1] > enemyHelper.y && projectileHelper.location[1] < enemyHelper.y + enemyHelper.enemyHeight 
                && projectileHelper.location[0] > enemyHelper.x && projectileHelper.location[0] < enemyHelper.x + enemyHelper.enemyWidth) {
                    enemyHelper.hitPoints--;
                    game.elements.projectiles.splice(a, 1); //remove projectile if it hits something
                    game.playOuchSound();
                    continue;
                }
            }
        }
    },
    
    load: function () {
        if (typeof localStorage["playerLoot"] === "undefined" || typeof JSON.parse(localStorage.getItem("playerWeapon")).timer === "undefined") { //if the key "playerLoot" is undefined,
            return;                                             //there is no local storage to load, so we return
        } else {
            game.player.loot = parseInt(localStorage.getItem("playerLoot")); //if there is load data, we update key values
            game.player.weapon = JSON.parse(localStorage.getItem("playerWeapon"));
            game.player.kills = JSON.parse(localStorage.getItem("playerKills"));
            console.log("loaded"); //this was used for debugging
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
        localStorage.setItem("playerKills", JSON.stringify(game.player.kills));
        console.log("saved"); //used for debugging
    },
    saveHelper: {
        timer: 1000 //the first value we assign to the timer is 1000 so we immediately get a localStorage active.
    },
    drawAutosaveNotification: function () {
        if (game.saveHelper.timer < 120) {
            game.canvas.context.fillStyle = "#FFFFFF";
            game.canvas.context.font ="15px serif";
            game.canvas.context.fillText("- GAME SAVED -", 450, 30);
        }
    },
    reset: function () {
        localStorage.clear(); //pretty self-explanatory
        location.reload();
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
        stats.rows[1].cells[4].innerHTML = game.castle.hp;
        //table updated
        game.save();
        game.spawnEnemy();
        game.updateAllyAI();
        game.calculateProjectileProperties();
        game.player.weapon.timer += ((game.player.weapon.rate * 1000) / 60); //cool down the player's weapon each tick
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
        for (var i = 0; i < game.elements.projectiles.length; i++) {
            if (game.elements.projectiles.length === 0) {
                break;
            } else {
                game.drawProjectile(i);
            }
        }
        game.drawAllies(); //Draw allies
        game.drawAutosaveNotification();
        game.canvas.context.fillStyle = "#DDDDDD"; //make the castle light grey
        game.canvas.context.fillRect(game.castle.leftEdge, 230, 150, 250); //draw the castle
        game.canvas.context.fillStyle = "#FFFF3C"; //make the player yellow
        game.canvas.context.fillRect(game.player.x, game.player.y, 20, 20);
        
        game.gameLoop(); //re-iterate back to gameloop
    },
    gameLoop: function() { //the gameloop function
        /* fps check
        var thisLoop = new Date;
        var fps = 1000 / (thisLoop - game.date);
        console.log(fps);
        game.date = thisLoop;
        */
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
