// Begin kyles gnome animation
function myFunction() {
	document.getElementById("gnomeDiv").style.WebkitAnimation = "mynewmove 4s 2"; // Code for Safari 4.0 - 8.0
	document.getElementById("gnomeDiv").style.animation = "mynewmove 4s 2";
}
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