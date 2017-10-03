/* This component will render snippets. It will be a child of the groups component */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import swal from 'sweetalert2'
var config = require('./config'); // Load configs

// Import child components
import ViewPane from './ViewPane.js'
import EditPane from './EditPane.js'

var logged_in = false;

// Simple login conditional. If token found in localStorage, logged in. This will restrict all AJAX requests.
if (localStorage.getItem("token") !== null) {
  logged_in = true;
}

class Snippets extends Component {
  constructor() {
    super(); // Super is the context of the state in the component

    // Create the state
    this.state = {
      snippets: [], // THis component doesn't need that many states. Just the current snippet. If no prop is passed, this will be filled with all snippets found in group
      current_snippet: '',
      current_view: '', // This controls the current view. (edit, view)
    };
  }

  // Fetch all snippets
  fetchAllSnippets() {
    // If logged in, proceed
    if (logged_in) {

    var api = config.api.url + '/snippets/';
    var token = localStorage.getItem("token");
    var authOptions = { 'Authorization': 'Token ' + token }
    axios.get(api, {headers: authOptions})
      .then(res => {
        this.setState({ snippets: res.data });
      }).catch((error) => {
        console.log(error);
      });

    } // End auth check
  }

  // Handle click events on snippegs
  handleClick(snippet) {
    this.setState({ current_snippet: snippet });
    this.setState({ current_view: 'view' });
  }

  // Handle edit events 
  handleEdit(snippet) {
    this.setState({ current_snippet: snippet });
    this.setState({ current_view: 'edit' });
  }

  handleDelete(snippet) {
    // If logged in, proceed
    if (logged_in) {

    swal({
      title: 'Delete "' + snippet.title + '"?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#fcfcfc',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonClass: 'btn btn-large btn-negative',
      cancelButtonClass: 'btn btn-large btn-default',
      buttonsStyling: false
    }).then(() => {
      // Run delete with axios
      var api = config.api.url + '/snippet/' + snippet.id;
      var token = localStorage.getItem("token");
      var authOptions = { 'Authorization': 'Token ' + token }
      axios.delete(api, {headers: authOptions}).then(() => {
        swal(
          'Snippet Deleted',
          'Your selected file has been deleted.',
          'success'
        )
        // Set state to something to rerender.
        this.setState({current_view: 'snippet_deleted'});

        // Delete DOM element directly of current selected snippet
        document.getElementById('tr-snippet-' + snippet.id).remove(); // Is this a bad idea. I don't know.
        this.setState(this.state); // Force Rerender by setting state to self. Wtf
      }).catch((error) => {
        console.log(error);
        swal(
          'Oops...',
          'Could not delete snippet. Error: ' + error,
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

    } // End auth check
  }

  saveSnippetTitle(id, title) {
    // Submit POST to create new group
    var api = config.api.url + '/snippet/' + id;
      var token = localStorage.getItem("token");
      var authOptions = { 'Authorization': 'Token ' + token }
      axios.patch(api, {
          'title': title,
        }, {headers: authOptions}).then(() => {
          // Show nothing.
        }).catch(function (error) {
          console.log(error);
          swal(
          'Oops...',
          'Could not save group. snippet: ' + error,
          'error'
        )
      });
  }

  saveSnippetDesc(id, desc) {
    // Submit POST to create new group
    var api = config.api.url + '/snippet/' + id;
      var token = localStorage.getItem("token");
      var authOptions = { 'Authorization': 'Token ' + token }
      axios.patch(api, {
          'description': desc,
        }, {headers: authOptions}).then(() => {
          // Show nothing.
        }).catch(function (error) {
          console.log(error);
          swal(
          'Oops...',
          'Could not save snippet. Error: ' + error,
          'error'
        )
      });
  }

  // Handle click events on snippegs
  handleEditName(snippet) {
    // Use contentEditable for this!
    var table_title = document.getElementById('tr-snippet-' + snippet.id).getElementsByClassName('td-title')[0];
    table_title.contentEditable = true;

    table_title.addEventListener('blur', (e) => {
      // On blur or clicking on something else, save changes!
      table_title.contentEditable = false; // Disable content editing
      this.saveSnippetTitle(snippet.id, table_title.innerText); // Save data!
    });

    table_title.addEventListener('keypress', (e) => {
      // If enter key pressed
      if (e.which === 13) {
        e.preventDefault(); // Prevent enter from actually doing anything
        table_title.contentEditable = false; // Disable content editing
        this.saveSnippetTitle(snippet.id, table_title.innerText); // Save data!
      }
    });  
  }

  // Handle click events on snippegs
  handleEditDesc(snippet) {
    // Use contentEditable for this!
    var table_desc = document.getElementById('tr-snippet-' + snippet.id).getElementsByClassName('td-desc')[0];
    table_desc.contentEditable = true;

    table_desc.addEventListener('blur', (e) => {
      // On blur or clicking on something else, save changes!
      table_desc.contentEditable = false; // Disable content editing
      this.saveSnippetDesc(snippet.id, table_desc.innerText); // Save data!
    });

    table_desc.addEventListener('keypress', (e) => {
      // If enter key pressed
      if (e.which === 13) {
        e.preventDefault(); // Prevent enter from actually doing anything
        table_desc.contentEditable = false; // Disable content editing
        this.saveSnippetDesc(snippet.id, table_desc.innerText); // Save data!
      }
    });
  }

  // On initial component render/mount
  componentDidMount() { 
    //this.setState({currentgroup: this.props.currentGroup})
    //this.fetchSnippets(this.state.currentgroup);
    //console.log(this.state.currentgroup)
  }

  // Oh wait, you should set handlers to change the state, then when the state changes, then do something
  componentDidUpdate() {
    // If current snippet not null, and current view is "view", render component
    if (this.state.current_snippet && this.state.current_view === 'view') {
      ReactDOM.unmountComponentAtNode(document.getElementById('code-pane'));
      // I will be passing id only, since I will be performing AJAX on the edit view repeatedly on the component
      ReactDOM.render(<ViewPane currentSnippet={this.state.current_snippet.id} />, document.getElementById('code-pane'));
    } else if (this.state.current_snippet && this.state.current_view === 'edit') {
      ReactDOM.unmountComponentAtNode(document.getElementById('code-pane'));
      // I will be passing id only, since I will be performing AJAX on the edit view repeatedly on the component
      ReactDOM.render(<EditPane currentSnippet={this.state.current_snippet.id} />, document.getElementById('code-pane'));
    }
  }

  render() {
    var snippets_arr = [];
    var stateSnippets; // Will hold the prop passed by the Groups parent object

    // If the passed in prop is defined, set the variable to evaulate properly
    if (typeof this.props.currentGroup !== 'undefined') {
      stateSnippets = this.props.currentGroup.snippets;
    }

    // If stateSnippets not null, render snippets. Else get all snippets
    if (stateSnippets) {
      stateSnippets.map((snippet, index) => {
          snippets_arr.push(
            <tr key={index} id={"tr-snippet-" + snippet.id}>
              <td className="td-title" onDoubleClick={this.handleEditName.bind(this, snippet)} onClick={this.handleClick.bind(this, snippet)}>{snippet.title}</td>
              <td className="td-desc" onDoubleClick={this.handleEditDesc.bind(this, snippet)} onClick={this.handleClick.bind(this, snippet)}>{snippet.description}</td>
              <td>
                  <button className="btn btn-mini btn-default" onClick={this.handleEdit.bind(this, snippet)}><span className="icon icon-pencil"></span> Edit</button>&nbsp;&nbsp;
                  <button className="btn btn-mini btn-negative" onClick={this.handleDelete.bind(this, snippet)}><span className="icon icon-trash"></span></button>
              </td>
            </tr>
          );
      });
    } else {
      // So if state does not contain snippets, set the state to all the snippets found. That way it won't enter a render loop
      // If state has less than 1 snippet, pull all snippets (empty)
      if (this.state.snippets < 1) {
        // If logged in, proceed
        if (logged_in) {

        var api = config.api.url + '/snippets/';
        var token = localStorage.getItem("token");
        var authOptions = { 'Authorization': 'Token ' + token }

        // Run axios request to pull all snippets
        axios.get(api, {headers: authOptions})
          .then(res => {
            res.data.map((snippet, index) => {
              /* Old code
              snippets_arr.push(
                <tr key={index} id={"tr-snippet-" + snippet.id}>
                  <td onClick={this.handleClick.bind(this, snippet)}>{snippet.title}</td>
                  <td onClick={this.handleClick.bind(this, snippet)}>{snippet.description}</td>
                  <td>
                      <button className="btn btn-mini btn-default" onClick={this.handleEdit.bind(this, snippet)}><span className="icon icon-pencil"></span> Edit</button>&nbsp;&nbsp;
                      <button className="btn btn-mini btn-negative" onClick={this.handleDelete.bind(this, snippet)}><span className="icon icon-trash"></span></button>
                  </td>
                </tr>
              );
              */
              snippets_arr.push(
                <tr key={index} id={"tr-snippet-" + snippet.id}>
                  <td className="td-title" onDoubleClick={this.handleEditName.bind(this, snippet)} onClick={this.handleClick.bind(this, snippet)}>{snippet.title}</td>
                  <td className="td-desc" onDoubleClick={this.handleEditDesc.bind(this, snippet)} onClick={this.handleClick.bind(this, snippet)}>{snippet.description}</td>
                  <td>
                      <button className="btn btn-mini btn-default" onClick={this.handleEdit.bind(this, snippet)}><span className="icon icon-pencil"></span> Edit</button>&nbsp;&nbsp;
                      <button className="btn btn-mini btn-negative" onClick={this.handleDelete.bind(this, snippet)}><span className="icon icon-trash"></span></button>
                  </td>
                </tr>
              );
            });

            // When mapping completed, add snippets to state
            this.setState({snippets: snippets_arr})

          }).catch((error) => {
            console.log(error);
          });

        } // End auth check
      }
    }
    

    // Ugh I have to render the whole table
    if (!stateSnippets) {
      return (
        <table className="table-striped">
          <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th></th>
          </tr>
          </thead>
          <tbody>{this.state.snippets}</tbody>
        </table>
      );
    } else {
      return (
        <table className="table-striped">
          <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th></th>
          </tr>
          </thead>
          <tbody><tr></tr>{snippets_arr}</tbody>
        </table>
      );
    }
    
  }
}

export default Snippets;
