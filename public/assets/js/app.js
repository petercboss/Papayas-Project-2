// Begin kyles gnome animation
function myFunction() {
	document.getElementById("gnomeDiv").style.WebkitAnimation = "mynewmove 4s 2"; // Code for Safari 4.0 - 8.0
	document.getElementById("gnomeDiv").style.animation = "mynewmove 4s 2";
}
// End kyles gnome animation

// // begin google earth api

// var query = "mountains";
// var API_KEY = "AIzaSyCnhWzIIcj-lCLUynULWI2CdBHiixx7Tis";
// var ENGINE_ID = "your_engine_id";
// var API_URL = `
//   https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${ENGINE_ID}&searchType=image&q=${query}
// `

// $(document).ready(function () {

// 	$.getJSON(API_URL, {
// 			tags: query,
// 			tagmode: "any",
// 			format: "json"
// 		},
// 		function (data) {
// 			var rnd = Math.floor(Math.random() * data.items.length);

// 			var image_src = data.items[rnd]['link'];

// 			$('body').css('background-image', "url('" + image_src + "')");

// 		});

// });

// end google earth api

// show and hide


$(function () {
	function runEffect() {
		$("#effect").hide("blind", {
			times: 10,
			distance: 100
		}, 1000, callback);
	}
	// callback function to bring a hidden box back
	function callback() {
		setTimeout(function () {
			$("#effect")
				.removeAttr("style")
				.hide()
				.fadeIn();
		}, 1000);
	}

	$("a.btn-primary").click(function () {
		alert('clicked');
		runEffect();
		return false;
	});
});