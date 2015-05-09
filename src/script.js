var init = function() {
    
    var canvas = document.querySelector('canvas'),
        ctx = canvas.getContext('2d');
    
    var background = new Image();
    background.src = 'img/background_small.png';
    background.onload = function() {
        ctx.drawImage(background, 0, 0, 300, 150);
    }
}

window.onload = init();