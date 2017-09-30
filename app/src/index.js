import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Groups from './Groups';
import swal from 'sweetalert2';

var config = require('./config'); // Load configs

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// Save data to the current local store
localStorage.setItem("token", "81aaaac4ad188dab4aa27038abc21ea03268d08b");
// Access some stored data
alert( "token = " + localStorage.getItem("token"));

//localStorage.removeItem("token");

// Before rendering UI, check if user token exists, if not ask for credentials
/* Implement later */
/*
swal({
	title: 'Login to QuickSnipp',
	html:
		    '<input type="text" id="input-username" class="swal2-input" placeholder="Username" required>' +
		    '<input type="password" id="input-password" class="swal2-input" placeholder="Password" required>',
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

ReactDOM.render(<Groups />, document.getElementById('code-groups'))