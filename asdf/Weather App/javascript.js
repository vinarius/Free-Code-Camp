$(document).ready(function() {

    var lat, long, temp, displayCity, displayHumidity, displayMain, displayState, displayTemp, displayWindSpeed, iconCode;
    
    var displaySunset, displaySunrise;
  
    function getLocation() {
      $.getJSON("http://ip-api.com/json", function(json) {
        lat = json.lat;
        long = json.lon;
        displayCity = json.city;
        displayState = json.regionName;
        $("#locationData").html(displayCity + ", " + displayState)
      }).done(getWeather);
    }
  
    function getWeather() {
      // use user coordinates to draw weather info
      $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&APPID=0802a1e93350cb73b28206dfb55d883b", function(json) {
        displayMain = json.weather[0].main;
        displayWindSpeed = json.wind.speed * 1.94;
        displayHumidity = json.main.humidity;
        $("#humidity").html("Humidity level: " + displayHumidity + "%"); //render humidity level
        $("#windSpeed").html("Wind speed: " + displayWindSpeed + " knots"); //render wind speed
        temp = json.main.temp; //api defaults to kelvin
        if (document.getElementById('f').checked) {
          displayTemp = Math.floor(temp * (9 / 5) - 459.67); //kelvin to Fahrenheit
        }
        $("#weatherData1").html(displayMain + ", " + displayTemp + "&deg;F");
        iconCode = json.weather[0].icon;
        var html = '<img src="http://openweathermap.org/img/w/' + iconCode + '.png" alt=weather icon>';
        $("#otherData").html(html);
        // display sunrise
        displaySunrise = json.sys.sunrise;
        var dateSunrise = new Date(displaySunrise * 1000);
        var timestrSunrise = dateSunrise.toLocaleTimeString();
        $("#sunrise").html("Sunrise: " + timestrSunrise);
        // display sunset
        displaySunset = json.sys.sunset;
        var dateSunset = new Date(displaySunset * 1000);
        var timestrSunset = dateSunset.toLocaleTimeString();
        $("#sunset").html("Sunset: " + timestrSunset);
      });
      
      $("#c").click(function() {
        displayTemp = Math.floor(temp - 273.15); //kelvin to Celsius
        $("#weatherData1").html(displayMain + ", " + displayTemp + "&deg;C");
      });
      
      $("#f").click(function() {
        displayTemp = Math.floor(temp * (9 / 5) - 459.67); //kelvin to fahrenheit
        $("#weatherData1").html(displayMain + ", " + displayTemp + "&deg;F");
      });
  
    }
  
    getLocation();
  
  });