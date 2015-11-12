window.onload = function() {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(0,0,150,75);
  
  var data = [
      {
          value: 12,
          color:"#700f0f",
          highlight: "#d2bca1",
          label: "Studera"
      },
      {
          value: 6,
          color:"#ffd07f",
          highlight: "#d2bca1",
          label: "Sova"
      },
      {
          value: 4,
          color: "#8e8e5b",
          highlight: "#d2bca1",
          label: "Arbeta"
      },
      {
          value: 1,
          color: "#ae5656",
          highlight: "#d2bca1",
          label: "Äta"
      },
      {
          value: 1,
          color: "#a2650e",
          highlight: "#d2bca1",
          label: "Fritid"
      }
  ]
  
  var myPieChart = new Chart(ctx).Pie(data);

  

};

