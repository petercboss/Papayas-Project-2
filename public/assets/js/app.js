// Begin kyles gnome animation
// function myFunction() {
// 	document.getElementById("gnomeDiv").style.WebkitAnimation = "mynewmove 4s 2"; // Code for Safari 4.0 - 8.0
// 	document.getElementById("gnomeDiv").style.animation = "mynewmove 4s 2";
// }
$(document).ready(function () {
	$("#b").delay(500).animate({
		bottom: +300
	}, 1000);
	$("#b").delay(1000).animate({
		bottom: -300
	}, 1000);
	$("#b").animate({
		right: -400
	}, 1000);
	$("#b").delay(1500).animate({
		left: -900
	}, 2000);
	$("#b").delay(3000).animate({
		left: +900
	}, 1000);
	$("#b").delay(5000).animate({
		top: -900
	}, 1000);
	$("#b").delay(6000).animate({
		top: +1300
	}, 1000);
	$("#b").delay(7000).animate({
		top: -900
	}, 6000);
});
// End kyles gnome animation



// Google Signin
function onSignIn(googleUser) {

	var profile = googleUser.getBasicProfile();
	$('.g-signin2').css('display', 'none');
	$('.data').css('display', 'block');
	$('#pic').attr('src', profile.getImageUrl());
	$('#email').text(profile.getEmail());
}

function signOut() {

	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
		alert('You Have Been Successfully Signed Out');

		$('.g-signin2').css('display', 'block');
	})
}

$(".btn-secondary").on("click", function(event) {
	event.preventDefault();
	alert("You've Clicked Submit!");
});