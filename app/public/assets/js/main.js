$(document).ready(function(){

	/*
	window.setInterval(function(){
	  	/// call your function here
	  	Prism.highlightAll();
    	console.log("Activated highlighting")
	}, 2000);
	*/

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

	$('#delete-snippet').on('mousedown', function(){
		swal({
		  title: 'Are you sure?',
		  text: "You won't be able to revert this!",
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Yes, delete it!',
		  cancelButtonText: 'No, cancel!',
		  confirmButtonClass: 'btn btn-success',
		  cancelButtonClass: 'btn btn-danger',
		  buttonsStyling: false
		}).then(function () {
		  swal(
		    'Deleted!',
		    'Your file has been deleted.',
		    'success'
		  )
		}, function (dismiss) {
		  // dismiss can be 'cancel', 'overlay',
		  // 'close', and 'timer'
		  if (dismiss === 'cancel') {
		    swal(
		      'Cancelled',
		      'Your imaginary file is safe :)',
		      'error'
		    )
		  }
		})
	});

})