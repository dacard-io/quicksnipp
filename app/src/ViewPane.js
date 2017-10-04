import React, { Component } from 'react';
import ReactDOM from 'react-dom';
//import swal from 'sweetalert2'
import axios from 'axios';
import Prism from 'prismjs' // Syntax highlighting lib
var config = require('./config'); // Load configs

var logged_in = false;

// Simple login conditional. If token found in localStorage, logged in. This will restrict all AJAX requests.
if (localStorage.getItem("token") !== null) {
  logged_in = true;
}

class ViewPane extends Component {
  // Lets create the state by initializing the constructor
  constructor(){
    super(); // Super is the context of the state in the component
    
    // Create the state
    this.state = {
      current_snippet: ''
    };
  }

  // Fetch self data
  fetchSelf(id) {
    // If logged in, proceed
    if (logged_in) {

    var api = config.api.url + '/snippet/' + id;
    var token = localStorage.getItem("token");
    var authOptions = { 'Authorization': 'Token ' + token }
    axios.get(api, {headers: authOptions})
      .then(res => {
        this.setState({ current_snippet: res.data });
      }).catch((error) => {
        console.log(error);
      });

    } // End of auth check
  }

  // After render
  componentDidMount() {
    // Remove any toolbar controls and buttons
    ReactDOM.unmountComponentAtNode(document.getElementById('toolbar-controls'));
    // Only when component is mounted, then fetch
    this.fetchSelf(this.props.currentSnippet);
  }

  componentWillUnmount() {
    //this.fetchSelf().abort();
    //this.loadInterval && clearInterval(this.loadInterval);
    //this.loadInterval = false;
  }

  componentDidUpdate() {
    // If state of current_snippet not empty, syntax highlight
    if ( this.state.current_snippet ) {
      // Highlight each file with Prism.js
      Prism.highlightAll();
    }
  }

  render() {
    // Empty array to hold files
    var files_arr = [];

    // If state for current snippet not set, retrieve the snippet
    if ( !this.state.current_snippet ) {
      //this.fetchSelf(this.props.currentSnippet);
    }

    // If current_snippet state set, map files
    if ( this.state.current_snippet ) {
      this.state.current_snippet.files.map((file, index) => {
        var file_lang = 'language-' + file.language;
        files_arr.push(
          <div className="file-section" key={index}>
              <h4>{file.title}</h4>
              <p>{file.description}</p>
              <pre><code className={file_lang}>{file.code}</code></pre>
              <hr/>
          </div>
        )
      });
    }

    // Handle case where the response is not here yet
    if ( !this.state.current_snippet ) {
      return (<div className="snippet-edit-react-renderer"><h2>No Snippet Loaded</h2></div>);
    } else if ( files_arr.length === 0 ) {
      // If files_arr empty, show no files
      return (
        <div className="snippet-view-react-renderer">
          <h2 id="snippet-name">{this.state.current_snippet.title}</h2>
          <p id="snippet-desc">{this.state.current_snippet.description}</p>
          <hr/>
          <p><b>No files found</b></p>
        </div>
      );
    } else {
      return (
        <div className="snippet-view-react-renderer">
          <h2 id="snippet-name">{this.state.current_snippet.title}</h2>
          <p id="snippet-desc">{this.state.current_snippet.description}</p>
          <hr/>
          {files_arr}
        </div>
      );
    }

  }
}

export default ViewPane;
