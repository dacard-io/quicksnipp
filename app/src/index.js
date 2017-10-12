import React from 'react';
import ReactDOM from 'react-dom';
import Groups from './Groups';
import swal from 'sweetalert2';
import axios from 'axios'; // Promise library

var config = require('./config'); // Load configs

// Before rendering UI, check if user token exists, if not ask for credentials
var logged_in = false;

if (localStorage.getItem("token") !== null) {
  logged_in = true;
}

// If already logged in, just show the view, else show prompt
if (logged_in) {
	ReactDOM.render(<Groups />, document.getElementById('code-groups'))
} else {
	loginPrompt();
}

// Loop until logged_in true (when use is successfully authenticated)
function loginPrompt() {
	swal({
	  title: 'Login to QuickSnipp',
	  allowOutsideClick: false,
	  showLoaderOnConfirm: true,
	  confirmButtonText: 'Login',
	  confirmButtonColor: '#3085d6',
	  html:
	  	'<p>Get access to your private code snippets by entering your login credentials. If you do not have an account, \
	  	<a id="register-account" href="#">click here to register</a>.</p>' +
	    '<input id="input-username" class="swal2-input" placeholder="Username" required>' +
	    '<input type="password" id="input-password" class="swal2-input" placeholder="Password" required>',
	  preConfirm: function () {
	    return new Promise(function (resolve) {
	      resolve([
	        document.getElementById('input-username').value,
	        document.getElementById('input-password').value
	      ])
	    })
	  }
	}).then((result) => {
	  	// Submit POST to get auth key
	  	var api = config.api.url + '/auth';
		axios.post(api, {
	    	'username': result[0],
			'password': result[1],
	  	}).then((res) => {
		    swal({
    			allowOutsideClick: false,
			  	title: 'Successfully logged in',
			  	text: '',
			  	type: 'success'
			}).then(() => {
				// Save authToken to localStorage
				localStorage.setItem("token", res.data.token)
				// Refresh page
				location.reload(); // Reload page!
			})
			
			
	  	}).catch(function (error) {
		    swal({
		    	allowOutsideClick: false,
		    	title: 'Unauthorized',
			  	text: 'Incorrect username or password',
			  	type: 'error'
		    }).then(() => {
				loginPrompt(); // Rerun function
			})
	  	});
	}).catch(() => swal.noop)

	// Add event listener to modal link (only if the DOM element exists)!
	if (document.getElementById('register-account')) {
		document.getElementById('register-account').addEventListener('mousedown', function(){
			registerPrompt();
		});
	}
}

function registerPrompt(){
	swal.close(); // Close any open modals

	// Open new prompt for account registration
	swal({
	  title: 'Register Account',
	  allowOutsideClick: false,
	  showLoaderOnConfirm: true,
	  confirmButtonText: 'Create Account',
	  confirmButtonColor: '#3085d6',
	  showCancelButton: true,
	  html:
	  	'<p>Create a QuickSnipp account now to store your code snippets.</p>' +
	    '<input id="input-username" class="swal2-input" placeholder="Username" required>' +
	    '<input type="email" id="input-email" class="swal2-input" placeholder="Email" required>' +
	    '<input type="password" id="input-password" class="swal2-input" placeholder="Password" required>',
	  preConfirm: function () {
	    return new Promise(function (resolve) {
	      resolve([
	        document.getElementById('input-username').value,
	        document.getElementById('input-email').value,
	        document.getElementById('input-password').value
	      ])
	    })
	  }
	}).then((result) => {
	  	// Submit POST to get auth key
	  	var api = config.api.url + '/users/';
		axios.post(api, {
	    	'username': result[0],
	    	'email': result[1],
			'password': result[2]
	  	}).then((res) => {
		    swal(
			  'Successfully created account',
			  '',
			  'success'
			).then(() => {
				// Refresh page
				location.reload(); // Reload page!
			})
	  	}).catch(function (error) {
		    swal({
		    	allowOutsideClick: false,
		    	title: 'Error with creating account',
			  	text: 'Message: ' + error,
			  	type: 'error'
		    }).then(() => {
				registerPrompt(); // Rerun function
			})
	  	});
	}, function (dismiss) {
	  // If registration canceled, go back to registration
	  if (dismiss === 'cancel') {
	    loginPrompt();
	  }
	}).catch(() => swal.noop)
}


//ReactDOM.render(<Groups />, document.getElementById('code-groups'))