window.onload = function() {
  var canvas = document.getElementById("myChart");
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(0,0,150,75);
  
  var myPieChart = new Chart(ctx[0]).Pie(data);

  var data = [
      {
          value: 300,
          color:"#F7464A",
          highlight: "#FF5A5E",
          label: "Red"
      },
      {
          value: 50,
          color: "#46BFBD",
          highlight: "#5AD3D1",
          label: "Green"
      },
      {
          value: 100,
          color: "#FDB45C",
          highlight: "#FFC870",
          label: "Yellow"
      }
  ]

}

