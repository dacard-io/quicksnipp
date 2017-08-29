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

		// Bind addGroup function to the context of this component
		this.addGroup = this.addGroup.bind(this);
	}

	addGroup() {
		// SweetAlerts2 does not support forms... Well I'm doing it anyway :D
		swal({
		  title: 'Add a Group',
		  html:
		    '<input id="input-grouptitle" class="swal2-input" placeholder="Name of Group">' +
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
		}).then(function (result) {
		  	// Submit POST to create new group
		  	var api = 'http://localhost:8000/groups/';
			var token = '81aaaac4ad188dab4aa27038abc21ea03268d08b';
			var authOptions = { 'Authorization': 'Token ' + token }
			axios.post(api, {
		    	'title': result[0],
				'label_color': result[1],
				'snippets': []
		  	}, {headers: authOptions}).then(function (response) {
			    swal(
				  'Group Created',
				  '',
				  'success'
				);
				// Set the state of the component to be unloaded
				//this.state.loaded = false;
		  	}).catch(function (error) {
			    console.log(error);
			    swal(
				  'Oops...',
				  'Could not save group. Error: ' + error,
				  'error'
				)
		  	});
			/*
			axios.post(api, {headers: authOptions})
				.then(res => {
					title: result[0],
					label_color: result[1]
				}).catch(function(error){
					console.log(error);
					swal(
					  'Oops...',
					  'Could not save group. Error: ' + error,
					  'error'
					)
				})
			*/
		}).catch(swal.noop)
	}

	// I typically put my functions before state management
	fetchGroups() {
		this.setState({ loaded: false }); // Set component to be loading
		var api = 'http://localhost:8000/groups/';
		var token = '81aaaac4ad188dab4aa27038abc21ea03268d08b';
		var authOptions = { 'Authorization': 'Token ' + token }
		axios.get(api, {headers: authOptions})
			.then(res => {
				console.log("Res: ", res)
				var groups_res = res.data.map(function(obj, index){
					// States are immutable, so set a new array
					var newGroupsArray = this.state.groups.slice(); 
		        	newGroupsArray.push(obj);
		        	this.setState({ groups: newGroupsArray });
				}, this); // Map recieved groups data to the groups state
				/* Important! the second argument in the map "this" keeps the context of the component */
				this.setState({ loaded: true });
				this.render();
			}).catch(function(error){
				console.log(error);
			})
	}

	// Handle click events on groups
	handleClick(group) {
		console.log("Selected group: ", group)
	}

	// On Component Mount (Runs after render :o)
	componentDidMount() {	
		this.fetchGroups(); // Fetch current users groups on initial component mount
		
		// Add event listener to button in UI
		var addGroupBtn = document.getElementById('add-group');
		addGroupBtn.addEventListener('mousedown', () => this.addGroup()); // I have no idea why the fat arrow function works
	}

	// When component updates
	componentDidUpdate() {

		if (!this.state.loaded) {
			// If not loaded, fetch groups.
			//this.fetchGroups();
		}
	}

  	render() {
  		// Create array to hold groups
  		var groups_arr = [];

  		//console.log(this.state.groups)

  		this.state.groups.map((group, index) => {
  			groups_arr.push(
  				<span className="nav-group-item" key={index} onClick={this.handleClick.bind(this, group)}><span className="icon icon-record" style={{color: group.label_color}}></span> {group.title}</span>
			);
  		});

	    return (<div className="group-react-renderer">{groups_arr}</div>);
  	}
}



export default Groups;