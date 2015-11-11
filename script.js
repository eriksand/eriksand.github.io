var canvas = document.getElementById("myChart");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "#FF0000";
ctx.fillRect(0,0,150,75);

var data = [
    {
        value: 20,
        color:"#637b85"
    },
    {
        value : 30,
        color : "#2c9c69"
    },
    {
        value : 40,
        color : "#dbba34"
    },
    {
        value : 10,
        color : "#c62f29"
    }

];

new Chart(ctx).Doughnut(data);

