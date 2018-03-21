/*calendar*/
$(function() {
    $("#calendar").datepicker({
        inline: true,
        showOtherMonths: true,
        selectOtherMonths: false,
        dayNamesMin: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    });
});
/*weather*/
var weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
d = new Date();
var measurement = "cel";
$measurement = "cel";
$(document).ready(function() {
    $measurement = "cel";
    getLocation();
});

function setIcon(status) {
    switch (status) {
        case "Rain":
            $("#icon").append('<i class="wi wi-rain-mix"></i>');
            break;
        case "Drizzle":
            $("#icon").append('<i class="wi wi-rain-mix"></i>');
            break;
        case "Clear":
            $("#icon").append('<i class="wi wi-day-sunny"></i>');
            break;
        case "Clouds":
            $("#icon").append('<i class="wi wi-cloudy"></i>');
            break;
        case "Thunderstorm":
            $("#icon").append('<i class="wi wi-storm-showers"></i>');
            break;
        case "Snow":
            $("#icon").append('<i class="wi wi-snow"></i>');
            break;
        case "Mist":
            $("#icon").append('<i class="wi wi-fog"></i>');
            break;
        case "Fog":
            $("#icon").append('<i class="wi wi-fog"></i>');
            break;
        case "Haze":
            $("#icon").append('<i class="wi wi-smoke"></i>');
            break;
    }
}

function setCurrent(city) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" +
            city +
            "&APPID=3ea3b151f084feef6d75c864368f98a4",
        method: "GET",
        data: {},
        dataType: "json",
        success: function(data) {
            $("#city").empty();
            $("#city").append(city.substring(0, city.indexOf(",")));
            $("#temp").empty();
            if ($("#icon").is(":empty")) {
                setIcon(data.weather[0].main);
            }
            if ($("#temp").is(":empty")) {
                $("#temp").append(inCel(data.main.temp));
            }
        }
    });
}

function setForecast(city, reason) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast/daily?q=" +
            city +
            ",de&mode=json&appid=3ea3b151f084feef6d75c864368f98a4",
        method: "GET",
        data: {},
        dataType: "json",
        success: function(data) {
            var dayCounter = d.getDay();
            for (i = 0; i <= 3; i++) {
                if (dayCounter >= weekday.length - 1) {
                    dayCounter = 0;
                } else {
                    dayCounter += 1;
                }
                if (data.list[i].weather[0].main !== "" && reason !== "refresh") {
                    $("#weekdays").append(
                        '<div class="gap">' + weekday[dayCounter] + "</div>"
                    );
                    $(".icons").append(
                        '<div class="gap">' +
                        getIcon(data.list[i].weather[0].main) +
                        "</div>"
                    );
                }
                $("#forecast").append(
                    '<div class="gap">' + inCel(data.list[i].temp.max) + "</div>"
                );
            }
        }
    });
}

function getIcon(weather) {
    switch (weather) {
        case "Rain":
            return '<i class="wi wi-rain-mix"></i>';
        case "Drizzle":
            return '<i class="wi wi-rain-mix"></i>';
        case "Clouds":
            return '<i class="wi wi-cloudy"></i>';
        case "Clear":
            return '<i class="wi wi-day-sunny"></i>';
        case "Thunderstorm":
            return '<i class="wi wi-storm-showers"></i>';
        case "Snow":
            return '<i class="wi wi-snow"></i>';
        case "Haze":
            return '<i class="wi wi-smoke"></i>';
        case "Fog":
            return '<i class="wi wi-fog"></i>';
        case "Mist":
            return '<i class="wi wi-fog"></i>';
        default:
            return '<i class="wi wi-time-1"></i>';
    }
}

function inCel(value, reason) {
    if ($measurement === "cel") {
        return Math.round(value - 273.15) + "°";
    } else {}
}

function getLocation() {
    $.ajax({
        url: "https://ipapi.co/json/",
        method: "GET",
        data: {},
        dataType: "json",
        success: function(data) {
            $city = data.country_name + "," + data.timezone;
            setCurrent($city);
            setForecast($city);
        },
        error: function(err) {
            console.log(err);
        }
    });
}
// Begin kyles gnome animation
function myFunction() {
    document.getElementById("gnomeDiv").style.WebkitAnimation = "mynewmove 4s 2"; // Code for Safari 4.0 - 8.0
    document.getElementById("gnomeDiv").style.animation = "mynewmove 4s 2";
}
// End kyles gnome animation

// begin google earth api

var query = "mountains";
var API_KEY = "AIzaSyCnhWzIIcj-lCLUynULWI2CdBHiixx7Tis";
var ENGINE_ID = "your_engine_id";
var API_URL = `
  https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${ENGINE_ID}&searchType=image&q=${query}
`

$(document).ready(function() {

    $.getJSON(API_URL, {
            tags: query,
            tagmode: "any",
            format: "json"
        },
        function(data) {
            var rnd = Math.floor(Math.random() * data.items.length);

            var image_src = data.items[rnd]['link'];

            $('body').css('background-image', "url('" + image_src + "')");

        });

});

// end google earth api

// new gnone config
// var id = setInterval(frame, 5);

// function frame() {
//     if (/* test for finished */) {
//         clearInterval(id);
//     } else {
//         /* code to change the element style */  
//     }
// }

function myMove() {
    var elem = document.getElementById("myAnimation"); 
    var pos = 0;
    var id = setInterval(frame, 10);
    function frame() {
        if (pos == 350) {
            clearInterval(id);
        } else {
            pos++; 
            elem.style.top = pos + 'px'; 
            elem.style.left = pos + 'px'; 
        }
    }
}

// end new gnome config