$(document).ready(function(){

	$('#add-group').on('mousedown', function(){
		// Create a sweetalert
		swal(
		  'Good job!',
		  'Group added',
		  'success'
		);
	})

	$('#save-snippet').on('mousedown', function(){
		// Create a sweetalert
		swal(
		  'Good job!',
		  'Snippet Saved',
		  'success'
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