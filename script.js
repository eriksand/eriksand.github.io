window.onload = function() {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(0,0,150,75);
  
  var data = [
      {
          value: 12,
          color:"#700f0f",
          highlight: "#FF5A5E",
          label: "Studera"
      },
      {
          value: 6,
          color:"#ffd07f",
          highlight: "#FF5A5E",
          label: "Sova"
      },
      {
          value: 4,
          color: "#8e8e5b",
          highlight: "#5AD3D1",
          label: "Arbeta"
      },
      {
          value: 1,
          color: "#ae5656",
          highlight: "#5AD3D1",
          label: "Äta"
      },
      {
          value: 1,
          color: "#a2650e",
          highlight: "#FFC870",
          label: "Fritid"
      }
  ]
  
  var myPieChart = new Chart(ctx).Pie(data);

  

};

