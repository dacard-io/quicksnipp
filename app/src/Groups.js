/* Controls code group rendering and behaviors. This also includes the "Add Group" button behaviors */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'; // Promise library
import swal from 'sweetalert2';
var config = require('./config'); // Load configs

// Import child component
import Snippets from './Snippets.js'

var logged_in = false;

// Simple login conditional
if (localStorage.getItem("token") !== null) {
  //...
  console.log("Token found: ", localStorage.getItem("token"))
}

class Groups extends Component {
	// Lets create the state by initializing the constructor
	constructor(){
		super(); // Super is the context of the state in the component
		
		// Create the state
		this.state = {
			groups: [],
			current_group: ''
		};
	}

	addGroup() {
		// SweetAlerts2 does not support forms... Well I'm doing it anyway :D
		swal({
		  title: 'Add a Group',
		  html:
		    '<input id="input-grouptitle" class="swal2-input" placeholder="Name of Group" required>' +
		    '<input id="input-groupcolor" class="swal2-input" placeholder="Group Color (CSS colors please)">',
		  preConfirm: function () {
		    return new Promise(function (resolve) {
		      resolve([
		        //$('#swal-input1').val(),
		        //$('#swal-input2').val()
		        document.getElementById('input-grouptitle').value,
		        document.getElementById('input-groupcolor').value
		      ])
		    })
		  },
		  onOpen: function () {
		    //$('#swal-input1').focus()
		  }
		}).then((result) => {
		  	// Submit POST to create new group
		  	var api = config.api.url + '/groups/';
			var token = localStorage.getItem("token");
			var authOptions = { 'Authorization': 'Token ' + token }
			axios.post(api, {
		    	'title': result[0],
				'label_color': result[1],
				'snippets': []
		  	}, {headers: authOptions}).then(() => {
			    swal(
				  'Group Created',
				  '',
				  'success'
				)
				this.fetchGroups(); // This got it working!
		  	}).catch(function (error) {
			    console.log(error);
			    swal(
				  'Oops...',
				  'Could not save group. Error: ' + error,
				  'error'
				)
		  	});
		}).catch(() => swal.noop)
	}

	// I typically put my functions before state management
	// This function should only run on mount!
	fetchGroups() {
		var api = config.api.url + '/groups/';
		var token = localStorage.getItem("token");
		var authOptions = { 'Authorization': 'Token ' + token }
		axios.get(api, {headers: authOptions})
			.then(res => {
				this.setState({ groups: res.data });
				//this.render();
			}).catch((error) => {
				console.log(error);
			});
	}

	fetchSingleGroup(group) {
		var api = config.api.url + '/group/' + group.id;
		var token = localStorage.getItem("token");
		var authOptions = { 'Authorization': 'Token ' + token }
		axios.get(api, {headers: authOptions})
			.then(res => {
				this.setState({ current_group: res.data });
				//this.render();
			}).catch((error) => {
				console.log(error);
			});
	}

	// Handle click events on groups
	handleClick(group) {
		this.setState({ current_group: group });
		this.fetchSingleGroup(group);
	}

	// Handle addgroup events - Having problem with function with using fetchGroups(). It was silently swallowing errors, so I created a handler instead
	// Handle click events on groups
	handleAddGroup() {
		this.fetchGroups();
		this.addGroup();
		//this.fetchGroups();
		
		console.log("AddGroup handler ran")
	}

	handleAddSnippet(group) {
		console.log("Adding snippet in: ", group)
		console.log("Current state groups: ", this.state.groups)

		// SweetAlerts2 does not support forms... Well I'm doing it anyway :D
		swal({
		  title: 'Add a Snippet',
		  html:
		    '<input id="input-snippet-title" class="swal2-input" placeholder="Name of Snippet" required>' +
		    '<input id="input-snippet-desc" class="swal2-input" placeholder="Description of Snippet">' +
		    '<select id="input-snippet-group" class="swal2-input">' +
		    '<option value="">None</option>' +
		    '</select>',
		  preConfirm: function () {
		    return new Promise(function (resolve) {
		      resolve([
		        //$('#swal-input1').val(),
		        //$('#swal-input2').val()
		        document.getElementById('input-snippet-title').value,
		        document.getElementById('input-snippet-desc').value,
		        document.getElementById('input-snippet-group').value
		      ])
		    })
		  },
		  onOpen: () => {
		    // Append groups to the snippet group selector
		    for (var i = 0; i < this.state.groups.length; i++) {
		    	console.log(this.state.groups[i]);
		    	var option = document.createElement("option");
		    	document.getElementById('input-snippet-group').appendChild(option);
		    	option.value = this.state.groups[i].id;
		    	option.textContent = this.state.groups[i].title;
		    }
		  }
		}).then((result) => {
		  	// Submit POST to create new group
		  	var api = config.api.url + '/snippets/';
			var token = localStorage.getItem("token");
			var authOptions = { 'Authorization': 'Token ' + token }
			axios.post(api, {
		    	'title': result[0],
				'description': result[1],
				'group_id': result[2]
		  	}, {headers: authOptions}).then(() => {
			    swal(
				  'Snippet Created in ID "' + result[2] + '"',
				  '',
				  'success'
				)

				// Render
				ReactDOM.unmountComponentAtNode(document.getElementById('snippet-list'));
				if (this.state.current_group) {
					this.fetchSingleGroup(this.state.current_group)
					ReactDOM.render(<Snippets currentGroup={this.state.current_group} />, document.getElementById('snippet-list')); // Render selected group
				} else {
					this.fetchGroups()
					ReactDOM.render(<Snippets />, document.getElementById('snippet-list')); // With no group selected, render all snippets
				}
		  	}).catch(function (error) {
			    console.log(error);
			    swal(
				  'Oops...',
				  'Could not save snippet. Error: ' + error,
				  'error'
				)
		  	});
		}).catch(() => swal.noop)
	}

	handleViewAll() {
		this.setState({ current_group: '' }); // Reset current group back to nothing
		ReactDOM.unmountComponentAtNode(document.getElementById('snippet-list'));
		ReactDOM.render(<Snippets />, document.getElementById('snippet-list'));
	}

	// Handle click events on groups
	handleEdit(group) {
		console.log("Edit group: ", group)
		swal(
		  'Group Edited',
		  '',
		  'success'
		);
	}
	// Handle click events on groups
	handleDelete(group) {
		console.log("Delete group: ", group)
		swal({
		  title: 'Delete group "' + group.title + '"?',
		  text: "You won't be able to revert this",
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Yes, delete it!',
		  cancelButtonText: 'No, cancel!',
		  confirmButtonClass: 'btn btn-large btn-negative',
		  cancelButtonClass: 'btn btn-large btn-default',
		  buttonsStyling: false
		}).then(() => {
			// Run delete with axios
			var api = config.api.url + '/group/' + group.id;
			var token = localStorage.getItem("token");
			var authOptions = { 'Authorization': 'Token ' + token }
			axios.delete(api, {headers: authOptions}).then(() => {
			    swal(
				    'Group Deleted',
				    'Your selected group has been deleted.',
				    'success'
				  )
				this.fetchGroups(); // This got it working!
		  	}).catch((error) => {
			    console.log(error);
			    swal(
				  'Oops...',
				  'Could not delete group. Error: ' + error,
				  'error'
				)
		  	});
		}, (dismiss) => {
		  // dismiss can be 'cancel', 'overlay',
		  // 'close', and 'timer'
		  if (dismiss === 'cancel') {
		  	/*
		    swal(
		      'Cancelled',
		      'Your group was not deleted',
		      'error'
		    )
			*/
		  }
		});
	}

	// On Component Mount (Runs after render :o)
	componentDidMount() {	
		// Add event listener to button in UI
		var addGroupBtn = document.getElementById('add-group');
		var addSnippetBtn = document.getElementById('add-snippet');
		var allSnippetsBtn = document.getElementById('all-snippets');
		addGroupBtn.addEventListener('mousedown', () => this.handleAddGroup()); // I have no idea why the fat arrow function fixed the stack overflow error
		addSnippetBtn.addEventListener('mousedown', () => this.handleAddSnippet(this.state.current_group)); // Pass in current group to function
		allSnippetsBtn.addEventListener('mousedown', () => this.handleViewAll());

		console.log("Button found: ", allSnippetsBtn)

		this.fetchGroups(); // Fetch current users groups on initial component mount
		ReactDOM.render(<Snippets />, document.getElementById('snippet-list'));
	}

	// When component updates
	componentDidUpdate() {
		//console.log("Component updated")
		//this.render(); // Run all re-renders here
		// When group selected rerender snippets component
		
		// If state for current_group set, render the component
		if (this.state.current_group) {
			ReactDOM.unmountComponentAtNode(document.getElementById('snippet-list'));
			ReactDOM.render(<Snippets currentGroup={this.state.current_group} />, document.getElementById('snippet-list'));
		}
	}

  	render() {
  		// Create array to hold groups
  		//this.fetchGroups();
  		var groups_arr = [];

  		//console.log("Render() executed")
  		//console.log(this.state.groups)

  		this.state.groups.map((group, index) => {
  			groups_arr.push(<span className="nav-group-item" key={index} onClick={this.handleClick.bind(this, group)}><span className="icon icon-record" style={{color: group.label_color}}></span> {group.title} <span className="icon icon-trash" onClick={this.handleDelete.bind(this, group)}></span><span className="icon icon-pencil" onClick={this.handleEdit.bind(this, group)}></span></span>);
  		});

	    return (<div className="group-react-renderer">{groups_arr}</div>);
  	}
}



export default Groups;