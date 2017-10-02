$(document).ready(function(){

	$('.nav-group-item').on('mousedown', function(){
		$(this).addClass('active')
		$(this).siblings().removeClass('active')
	})

	

	$('#add-group').on('mousedown', function(){
		console.log("CLass changed for body")
		// Instantiate color picker
		jscolor.installByClassName("jscolor");
	})

	$('#show-info').on('mousedown', function(){
		// Create a sweetalert
		swal(
		  'Quicksnipp v1',
		  'A simple code snippet storage service that utilizes a Node and React.js front-end, and a Python/Django Rest Framework backend.\
		  <br/><br/>\
		  Source code: <a href="#">Github</a><br/>\
		  Portfolio: <a href="//dacard.io" target="_blank">Dacard.io</a>\
		  '
		);
	})

})