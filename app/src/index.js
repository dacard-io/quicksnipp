import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Groups from './Groups';
import swal from 'sweetalert2';
import axios from 'axios'; // Promise library

var config = require('./config'); // Load configs

// Save data to the current local store
//localStorage.setItem("token", "81aaaac4ad188dab4aa27038abc21ea03268d08b");
// Access some stored data
//alert( "token = " + localStorage.getItem("token"));

//localStorage.removeItem("token");

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
	  html:
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
		console.log("User: ", document.getElementById('input-username').value)
		console.log("Pass: ", document.getElementById('input-password').value)
	  	// Submit POST to get auth key
	  	var api = config.api.url + '/auth';
		axios.post(api, {
	    	'username': result[0],
			'password': result[1],
	  	}).then((res) => {
		    swal(
			  'Successfully logged in',
			  '',
			  'success'
			)
			// Save authToken to localStorage
			localStorage.setItem("token", res.data.token)
			// Render view
			ReactDOM.render(<Groups />, document.getElementById('code-groups'))
	  	}).catch(function (error) {
		    swal({allowOutsideClick: false},
			  'Unauthorized',
			  'Incorrect username/password',
			  'error'
			)
	  	});
	}).catch(() => swal.noop)
}


//ReactDOM.render(<Groups />, document.getElementById('code-groups'))