import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Groups from './Groups';
import swal from 'sweetalert2'

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// Before rendering UI, check if user token exists, if not ask for credentials
/* Implement later
swal({
	title: 'Login',
	input: 'email',
	showCancelButton: false,
	confirmButtonText: 'Submit',
	showLoaderOnConfirm: true,
	preConfirm: function (email) {
	return new Promise(function (resolve, reject) {
	  setTimeout(function() {
	    if (email === 'taken@example.com') {
	      reject('This email is already taken.')
	    } else {
	      resolve()
	    }
	  }, 2000)
	})
	},
  	allowOutsideClick: false
}).then(function (email) {
  	swal({
    	type: 'success',
    	title: 'Ajax request finished!',
    	html: 'Submitted email: ' + email
  	})

  	// Render UI
	ReactDOM.render(<Groups />, document.getElementById('code-groups'))
})
*/

// Render UI
ReactDOM.render(<Groups />, document.getElementById('code-groups'))