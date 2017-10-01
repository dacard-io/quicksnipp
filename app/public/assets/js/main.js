$(document).ready(function(){

	$('.nav-group-item').on('mousedown', function(){
		$(this).addClass('active')
		$(this).siblings().removeClass('active')
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