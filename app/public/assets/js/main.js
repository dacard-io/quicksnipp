$(document).ready(function(){
	$('#show-info').on('mousedown', function(){
		// Create a sweetalert
		swal(
		  'Quicksnipp v1',
		  'A simple code snippet storage service that utilizes a Node/React.js front-end, and a Python/Django Rest Framework backend.\
		  <br/><br/>\
		  Source code: <a href="#">Github</a><br/>\
		  Portfolio: <a href="//dacard.io" target="_blank">Dacard.io</a>\
		  '
		);
	});

	// On each nav-group-item click, recreate event listeners
	$('#snippet-list td').on('mouseenter', function(){
		$(this).find('.quick-edit').addClass('show');
	}).on('mouseleave', function(){
		$(this).find('.quick-edit').removeClass('show');
	});
})

$(window).on('load', function(){

	// Select "All Snippets" group by default
	$('#all-snippets').addClass('active');

	$('.user-groups .nav-group-item').on('mousedown', function() {
		
		// I know this isn't great, but I will eventually get rid of this jQuery at some point in the future.
		$('.user-groups .nav-group-item').each(function(i, el) {
			$el_selected = $(el);
			$el_selected.removeClass('active');
		});

		$(this).addClass('active');
	});
});