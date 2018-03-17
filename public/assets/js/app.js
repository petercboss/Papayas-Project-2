/*calendar*/
$(function () {
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
$(document).ready(function () {
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
			"&APPID=18779931dba6c5d8e6c9cac52c1c2f90",
		method: "GET",
		data: {},
		dataType: "json",
		success: function (data) {
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
			",de&mode=json&appid=18779931dba6c5d8e6c9cac52c1c2f90",
		method: "GET",
		data: {},
		dataType: "json",
		success: function (data) {
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
		success: function (data) {
			$city = data.country_name + "," + data.timezone;
			setCurrent($city);
			setForecast($city);
		},
		error: function (err) {
			console.log(err);
		}
	});
}
/*music player*/
var num = 0;
var hiddenPlayer = $("#hidden-player");
var player = $("#player");
var title = $(".title");
var cover = $(".coverr");

function secondsTimeSpanToHMS(s) {
	var h = Math.floor(s / 3600);
	s -= h * 3600;
	var m = Math.floor(s / 60);
	s -= m * 60;
	return h + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
}
songs = [{
		src: "http://chenyiya.com/codepen/iron.mp3",
		title: "Woodkid - Iron",
		coverart: "http://chenyiya.com/codepen/iron-image.jpg"
	},
	{
		src: "http://chenyiya.com/codepen/A New Error.mp3",
		title: "Moderat - A New Error",
		coverart: "http://chenyiya.com/codepen/moderat.jpg"
	},
	{
		src: "http://chenyiya.com/codepen/midnight city.mp3",
		title: "M83 - Midnight City",
		coverart: "http://chenyiya.com/codepen/m83.jpg"
	}
];
var initSongSrc = songs[0].src;
var initSongTitle = songs[0].title;
var initSongCover = songs[0].coverart;
var items = songs.length - 1;
hiddenPlayer.attr("src", initSongSrc);
title.html(initSongTitle);
cover.attr("src", initSongCover);
$(".next").on("click", function () {
	var songOrder = hiddenPlayer.attr("order");
	if (items == songOrder) {
		num = 0;
		var songSrc = songs[0].src;
		var songTitle = songs[0].title;
		var songCover = songs[0].coverart;
		hiddenPlayer.attr("order", "0");
		hiddenPlayer.attr("src", songSrc).trigger("play");
		title.html(songTitle);
		cover.attr("src", songCover);
	} else {
		console.log(songOrder);
		num += 1;
		var songSrc = songs[num].src;
		var songTitle = songs[num].title;
		var songCover = songs[num].coverart;
		hiddenPlayer.attr("src", songSrc).trigger("play");
		title.html(songTitle);
		cover.attr("src", songCover);
		hiddenPlayer.attr("order", num);
	}
});
$(".prev").on("click", function () {
	var songOrder = hiddenPlayer.attr("order");
	if (songOrder == 0) {
		num = items;
		var songSrc = songs[items].src;
		var songTitle = songs[items].title;
		var songCover = songs[items].coverart;
		hiddenPlayer.attr("order", items);
		hiddenPlayer.attr("src", songSrc).trigger("play");
		title.html(songTitle);
		cover.attr("src", songCover);
	} else {
		num -= 1;
		var songSrc = songs[num].src;
		var songTitle = songs[num].title;
		var songCover = songs[num].coverart;
		hiddenPlayer.attr("src", songSrc).trigger("play");
		title.html(songTitle);
		cover.attr("src", songCover);
		hiddenPlayer.attr("order", num);
	}
});
$("#playmusic").click(function () {
	hiddenPlayer[0].play();
	$("#playmusic").hide();
	$("#pause")
		.show()
		.addClass("active");
});
$("#pause").click(function () {
	hiddenPlayer[0].pause();
	$("#playmusic").show();
	$("#pause").hide();
});
hiddenPlayer.on("timeupdate", function () {
	var songLength = secondsTimeSpanToHMS(this.duration);
	var songLengthParse = songLength.split(".")[0];
	var songCurrent = secondsTimeSpanToHMS(this.currentTime);
	var songCurrentParse = songCurrent.split(".")[0];
	$("progress").attr("value", this.currentTime / this.duration);
	if (!hiddenPlayer[0].paused) {
		$("#playmusic").hide();
		$("#pause").show();
		$("progress").css("cursor", "pointer");
		$("progress").on("click", function (e) {
			var parentOffset = $(this)
				.parent()
				.offset();
			var relX = e.pageX - parentOffset.left;
			var percPos = relX * 100 / 355;
			var second = hiddenPlayer[0].duration * parseInt(percPos) / 100;
			console.log(second);
			hiddenPlayer[0].currentTime = second;
		});
	}
	if (this.currentTime == this.duration) {
		$(".next").trigger("click");
	}
});
$("#mute").click(function () {
	hiddenPlayer[0].volume = 1;
	$("#mute").hide();
	$("#sound").show();
});
$("#sound").click(function () {
	hiddenPlayer[0].volume = 0;
	$("#mute").show();
	$("#sound").hide();
});


// Begin kyles gnome animation
function myFunction() {
    document.getElementById("gnomeDiv").style.WebkitAnimation = "mynewmove 4s 2"; // Code for Safari 4.0 - 8.0
    document.getElementById("gnomeDiv").style.animation = "mynewmove 4s 2";
}