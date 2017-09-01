/* This component will render snippets. It will be a child of the groups component */

import React, { Component } from 'react';
//import axios from 'axios';

class Snippets extends Component {
  constructor() {
    super(); // Super is the context of the state in the component

    // Create the state
    this.state = {
      snippets: [],
      current_snippet: '',
      //currentgroup: '' This is redundant. We can just use the prop. Its easier
    };
  }

  // Fetch requested snippet
  fetchSnippets(arg) {
    /*
    console.log("Fetching: ", arg)
    var snippets_arr = [];
    */
  }

  // Handle click events on groups
  handleClick(snippet) {
    console.log("You clicked on snippet: ", snippet);
  }

  // On initial component render/mount
  componentDidMount() { 
    //this.setState({currentgroup: this.props.currentGroup})
    //this.fetchSnippets(this.state.currentgroup);
  }

  componentDidUpdate() {
    console.log("State changed for <Snippet> component:", this.state.currentgroup)
  }

  render() {
    var stateSnippets = this.props.currentGroup.snippets;
    var snippets_arr = [];

    console.log("stateSnippets", stateSnippets)

    
    stateSnippets.map((snippet, index) => {
      console.log("Iteration: ", snippet)
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
