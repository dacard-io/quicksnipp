/* This component will render snippets. It will be a child of the groups component */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

// Import child component
import ViewPane from './ViewPane.js'

class Snippets extends Component {
  constructor() {
    super(); // Super is the context of the state in the component

    // Create the state
    this.state = {
      snippets: [], // THis component doesn't need that many states. Just the current snippet
      current_snippet: '',
      //currentgroup: '' This is redundant. We can just use the prop. Its easier
    };
  }

  // Fetch all snippets
  fetchAllSnippets() {
    /*
    console.log("Fetching: ", arg)
    var snippets_arr = [];
    */
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

  // Handle click events on groups
  handleClick(snippet) {
    this.setState({ current_snippet: snippet });
  }

  // On initial component render/mount
  componentDidMount() { 
    //this.setState({currentgroup: this.props.currentGroup})
    //this.fetchSnippets(this.state.currentgroup);
  }

  // Oh wait, you should set handlers to change the state, then when the state changes, then do something
  componentDidUpdate() {
    console.log("State changed for <Snippet> component:", this.state.current_snippet)
    // If current snippet selected, then show the view pane, else show blank pane
    if (this.state.current_snippet) {
      ReactDOM.unmountComponentAtNode(document.getElementById('code-pane'));
      ReactDOM.render(<ViewPane currentSnippet={this.state.current_snippet} />, document.getElementById('code-pane'));
    } else {

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
            <tr key={index} onClick={this.handleClick.bind(this, snippet)}>
              <td>{snippet.title}</td>
              <td>{snippet.description}</td>
              <td>
                  <button className="btn btn-mini btn-default"><span className="icon icon-pencil"></span> Edit</button>&nbsp;&nbsp;
                  <button className="btn btn-mini btn-negative"><span className="icon icon-trash"></span></button>
              </td>
            </tr>
          );
      });
    } else {
      console.log("stateSnippets evaluated to false")
      //this.fetchAllSnippets();
      var api = 'http://localhost:8000/snippets/';
      var token = '81aaaac4ad188dab4aa27038abc21ea03268d08b';
      var authOptions = { 'Authorization': 'Token ' + token }
      axios.get(api, {headers: authOptions})
        .then(res => {
          res.data.map((snippet, index) => {
            snippets_arr.push(
              <tr key={index} onClick={this.handleClick.bind(this, snippet)}>
                <td>{snippet.title}</td>
                <td>{snippet.description}</td>
                <td>
                    <button className="btn btn-mini btn-default"><span className="icon icon-pencil"></span> Edit</button>&nbsp;&nbsp;
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
