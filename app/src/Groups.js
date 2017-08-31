/* Controls code group rendering and behaviors. This also includes the "Add Group" button behaviors */

import React, { Component } from 'react';
import axios from 'axios'; // Promise library
import swal from 'sweetalert2';

class Groups extends Component {
	// Lets create the state by initializing the constructor
	constructor(){
		super(); // Super is the context of the state in the component
		
		// Create the state
		this.state = {
			groups: [],
			current_group: '',
			loaded: false
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
		  	var api = 'http://localhost:8000/groups/';
			var token = '81aaaac4ad188dab4aa27038abc21ea03268d08b';
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
		console.log("fetchGroups() function starting");
		var api = 'http://localhost:8000/groups/';
		var token = '81aaaac4ad188dab4aa27038abc21ea03268d08b';
		var authOptions = { 'Authorization': 'Token ' + token }
		axios.get(api, {headers: authOptions})
			.then(res => {
				console.log("Groups fetched!")
				this.setState({ groups: res.data });
				this.setState({ loaded: true });
				//this.render();
			}).catch((error) => {
				console.log(error);
			});
	}

	// Handle click events on groups
	handleClick(group) {
		console.log("Selected group: ", group)
		this.render();
	}

	// Handle addgroup events - Having problem with function with using fetchGroups(). It was silently swallowing errors, so I created a handler instead
	// Handle click events on groups
	handleAddGroup() {
		this.fetchGroups();
		this.addGroup();
		//this.fetchGroups();
		
		console.log("AddGroup handler ran")
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
		var api = 'http://localhost:8000/group/' + group.id;
		var token = '81aaaac4ad188dab4aa27038abc21ea03268d08b';
		var authOptions = { 'Authorization': 'Token ' + token }
		axios.delete(api, {headers: authOptions}).then(() => {
		    swal(
			  'Group Deleted',
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
		this.fetchGroups();
	}

	// On Component Mount (Runs after render :o)
	componentDidMount() {	
		// Add event listener to button in UI
		var addGroupBtn = document.getElementById('add-group');
		addGroupBtn.addEventListener('mousedown', () => this.handleAddGroup()); // I have no idea why the fat arrow function fixed the stack overflow error
	
		this.fetchGroups(); // Fetch current users groups on initial component mount
	}

	// When component updates
	componentDidUpdate() {
		//console.log("Component updated")
		//this.render(); // Run all re-renders here
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