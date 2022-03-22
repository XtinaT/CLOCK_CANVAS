"use strict";
var form = document.forms.form;
var button = form.elements.button;
button.addEventListener("click", validateForm, false);

function validateForm(e) {
  e = e || window.event;
  try {
    var form = document.forms.form;
    var diametrField = form.elements.diam;
    var diametr = parseInt(diametrField.value);

    if (isNaN(diametr)) {
      var sp = form.getElementsByTagName("span");
      sp[0].style.color = "red";
      sp[0].textContent = "Введите число от 200 до 800";
      e.preventDefault();
    } else if (diametr < 200 || diametr > 800) {
      var sp = form.getElementsByTagName("span");
      sp[0].style.color = "red";
      sp[0].textContent = "Диаметр часов должен быть от 200 до 800 пикселей";
      e.preventDefault();
    } else {
      var sp = form.getElementsByTagName("span");
      sp[0].textContent = null;
      button.removeEventListener("click", validateForm, false);
      showWatch(diametr);
    }
  } catch (ex) {
    alert("Что-то пошло не так!");
    e.preventDefault();
  }
}

function showWatch(diametr) {
  form.style.display = "none";
  var body = document.getElementsByTagName("body");
  var radius = diametr / 2;
  var reducedRadius = diametr / 2.5;
  var numbers = 12; //количесвто делений на циферблате
  var unit = 5; //количесвто делений между делениями numbers
  var standartHoursAngle = 360 / numbers; //угол между двумя делениями
  var standartMinutesAngle = 360 / (numbers * unit);
  var standartSecondsAngle = 360 / (numbers * unit);
  
  var clockCenterX = diametr / 2;
  var clockCenterY = diametr / 2;
  var cvs = document.createElement("canvas");
  cvs.setAttribute("id", "CVS");
  cvs.setAttribute("width", diametr);
  cvs.setAttribute("height", diametr);
  body[0].appendChild(cvs);
  
  function buildWatch() {
    var context = cvs.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, cvs.width, cvs.height);

    context.fillStyle = "#fccb66";
    context.beginPath();
    context.arc(clockCenterX, clockCenterY, radius, 0, Math.PI * 2, false);
    context.fill();

    var currTime = new Date();
    var text = formatTime(currTime);
    function formatTime(dt) {
      var hours = dt.getHours();
      var minutes = dt.getMinutes();
      var seconds = dt.getSeconds();
      var time =
        str0l(hours, 2) + ":" + str0l(minutes, 2) + ":" + str0l(seconds, 2);
      console.log(time);
      return time;
    }
    function str0l(val, len) {
      var strVal = val.toString();
      while (strVal.length < len) strVal = "0" + strVal;
      return strVal;
    }
    context.fillStyle = "black";
    context.font = `italic ${diametr / 12}px Arial`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, radius, diametr / 3);

    for (var i = 0; i < numbers; i++) {
      context.fillStyle = "#46b483";
      context.beginPath();
      var angle =
        ((standartHoursAngle * i + standartHoursAngle) / 180) * Math.PI;
      var numberCenterX = clockCenterX + reducedRadius * Math.sin(angle);
      var numberCenterY = clockCenterY - reducedRadius * Math.cos(angle);
      context.arc(
        numberCenterX,
        numberCenterY,
        diametr / 15,
        0,
        Math.PI * 2,
        false
      );
      context.fill();
      context.fillStyle = "black";
      context.font = `normal ${diametr / 12}px Arial`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(i + 1, numberCenterX, numberCenterY);
    }

    var hours = currTime.getHours();
    var minutes = currTime.getMinutes();
    var seconds = currTime.getSeconds();
    var ms = currTime.getMilliseconds();
    var ratio = standartHoursAngle / 60; //угол поворота часовой стрелки за 1 минуту

    var hoursAngle =
      ((standartHoursAngle * hours + ratio * minutes) / 180) * Math.PI;
    var minutesAngle = ((standartMinutesAngle * minutes) / 180) * Math.PI;
    var secondsAngle = ((standartSecondsAngle * seconds) / 180) * Math.PI;

    context.strokeStyle = "black";
    context.lineCap = "round";

    context.lineWidth = diametr / 37;
    context.beginPath();
    context.moveTo(clockCenterX, clockCenterY);
    context.lineTo(
      clockCenterX + Math.sin(hoursAngle) * reducedRadius * 0.8,
      clockCenterY - Math.cos(hoursAngle) * reducedRadius * 0.8
    );
    context.stroke();

    context.lineWidth = diametr / 60;
    context.beginPath();
    context.moveTo(clockCenterX, clockCenterY);
    context.lineTo(
      clockCenterX + Math.sin(minutesAngle) * reducedRadius,
      clockCenterY - Math.cos(minutesAngle) * reducedRadius
    );
    context.stroke();

    context.lineWidth = diametr / 130;
    context.beginPath();
    context.moveTo(clockCenterX, clockCenterY);
    context.lineTo(
      clockCenterX + Math.sin(secondsAngle) * reducedRadius * 1.1,
      clockCenterY - Math.cos(secondsAngle) * reducedRadius * 1.1
    );
    context.stroke();

    setTimeout(buildWatch, 1020 - ms);
  }
  buildWatch();
}