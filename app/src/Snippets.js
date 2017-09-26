/* This component will render snippets. It will be a child of the groups component */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

// Import child components
import ViewPane from './ViewPane.js'
import EditPane from './EditPane.js'

class Snippets extends Component {
  constructor() {
    super(); // Super is the context of the state in the component

    // Create the state
    this.state = {
      snippets: [], // THis component doesn't need that many states. Just the current snippet
      current_snippet: '',
      current_view: '', // Tis controls the current view. (edit, view)
    };
  }

  // Fetch all snippets
  fetchAllSnippets() {
    var api = 'http://localhost:8000/snippets/';
    var token = '81aaaac4ad188dab4aa27038abc21ea03268d08b';
    var authOptions = { 'Authorization': 'Token ' + token }
    axios.get(api, {headers: authOptions})
      .then(res => {
        console.log("Snippets fetched!")
        this.setState({ snippets: res.data });
      }).catch((error) => {
        console.log(error);
      });
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

  // On initial component render/mount
  componentDidMount() { 
    //this.setState({currentgroup: this.props.currentGroup})
    //this.fetchSnippets(this.state.currentgroup);
    console.log(this.state.currentgroup)
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
            <tr key={index}>
              <td onClick={this.handleClick.bind(this, snippet)}>{snippet.title}</td>
              <td onClick={this.handleClick.bind(this, snippet)}>{snippet.description}</td>
              <td>
                  <button className="btn btn-mini btn-default" onClick={this.handleEdit.bind(this, snippet)}><span className="icon icon-pencil"></span> Edit</button>&nbsp;&nbsp;
                  <button className="btn btn-mini btn-negative"><span className="icon icon-trash"></span></button>
              </td>
            </tr>
          );
      });
    } else {
      console.log("stateSnippets evaluated to false")
      var api = 'http://localhost:8000/snippets/';
      var token = '81aaaac4ad188dab4aa27038abc21ea03268d08b';
      var authOptions = { 'Authorization': 'Token ' + token }
      axios.get(api, {headers: authOptions})
        .then(res => {
          console.log(res)
          res.data.map((snippet, index) => {
            snippets_arr.push(
              <tr key={index}>
                <td onClick={this.handleClick.bind(this, snippet)}>{snippet.title}</td>
                <td onClick={this.handleClick.bind(this, snippet)}>{snippet.description}</td>
                <td>
                    <button className="btn btn-mini btn-default" onClick={this.handleEdit.bind(this, snippet)}><span className="icon icon-pencil"></span> Edit</button>&nbsp;&nbsp;
                    <button className="btn btn-mini btn-negative"><span className="icon icon-trash"></span></button>
                </td>
              </tr>
            );
          });
        }).catch((error) => {
          console.log(error);
        });
    }

    // Ugh I have to render the whole table
    return (
      <table className="table-striped">
        <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th></th>
        </tr>
        </thead>
        <tbody>{snippets_arr}</tbody>
      </table>
      );
  }
}

export default Snippets;
