import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import swal from 'sweetalert2'
import axios from 'axios';
var CodeMirror = require('react-codemirror'); // React component for CodeMirror IDE

// Language support is loaded from here (from the codemirror node package directly)
import '../node_modules/codemirror/mode/javascript/javascript';
import '../node_modules/codemirror/mode/php/php';

class EditPane extends Component {
  // Lets create the state by initializing the constructor
  constructor(){
    super(); // Super is the context of the state in the component
    
    // Create the state
    this.state = {
      current_snippet: '',
      loaded: false
    };
  }

  // Fetch all snippets
  fetchSelf(id) {
    var api = 'http://localhost:8000/snippet/' + id;
    var token = '81aaaac4ad188dab4aa27038abc21ea03268d08b';
    var authOptions = { 'Authorization': 'Token ' + token }
    axios.get(api, {headers: authOptions})
      .then(res => {
        console.log(res)
        console.log("Snippets fetched!")
        this.setState({ current_snippet: res.data });
        this.setState({ loaded: true });
      }).catch((error) => {
        console.log(error);
      });
  }

  // Save file by give file id, and other data to save
  saveFile(id, title, desc, lang, code) {
    // Perform a patch with axios to update file data
    var api = 'http://localhost:8000/file/' + id; // Concat id to url to utilize API to patch single file
    var token = '81aaaac4ad188dab4aa27038abc21ea03268d08b';
    var authOptions = { 'Authorization': 'Token ' + token }

    axios.patch(api, {
        'title': title,
        'description': desc,
        'language': lang,
        'code': code
      }, {headers: authOptions}).then((res) => {
        console.log("Response for save: ", res)
        swal(
          'File Saved',
          '',
          'success'
        )
      }).catch(function (error) {
        console.log(error);
        swal(
        'Oops...',
        'Could not save file. Error: ' + error,
        'error'
      )
    });
  }

  // Save all data in snippet (pass in snippet object from prop)
  saveData(snippet) {
    // For all files that exist, save each of them
    console.log("Data passed to save: ", snippet);

    // Get data from UI, save files first
    var files = document.getElementsByClassName('file-section');

    console.log(this.refs);

    // Update existing files
    for (var i = 0; i < files.length; i++) {
      var file_name = document.getElementById('file-title-' + this.state.current_snippet.files[i].id).value;
      var file_desc = document.getElementById('file-desc-' + this.state.current_snippet.files[i].id).value;
      var codemirror_ref = Object.values(this.refs)[i]; // Get the object values directly, to use the function
      var file_code = codemirror_ref.getCodeMirror().getValue() // That is ugly :o - have to use refs, then get the key of the refs
      console.log("To be saved: ", file_name, " ,", file_desc, " ,", file_code)
      this.saveFile(this.state.current_snippet.files[i].id, file_name, file_desc, 'php', file_code) // Just save the first snippet for testing
    }
    // Create new files
    // Update snippet info

    this.forceUpdate(); // Rerender
  }

  // After render
  componentDidMount() {
    // Create save and cancel buttons and attach event listeners to it
    ReactDOM.unmountComponentAtNode(document.getElementById('toolbar-controls'));
    // Create save snippet button with onclick event
    ReactDOM.render(<button id="save-snippet" className="btn btn-primary pull-right" onClick={this.saveData.bind(this, this.props.currentSnippet)}>Save</button>, document.getElementById('toolbar-controls'));
  }

  // On state change
  componentDidUpdate() {
    console.log(this.state)
  }

  render() {
    console.log("Rendered edit view")
    // Empty array to hold files
    var files_arr = [];

    // If state for current snippet not set, retrieve the snippet
    if ( !this.state.current_snippet ) {
      this.fetchSelf(this.props.currentSnippet);
    }

    // If current_snippet state set, map files
    if ( this.state.current_snippet ) {
      this.state.current_snippet.files.map((file, index) => {
        var file_lang = 'language-' + file.language;
        var options = {
          mode: file.language,
          lineNumbers: true
        }
        // The file to save to will be placed inside as an html-attrib 'data-file', use this to find the referring file.
        files_arr.push(
          <div className="file-section" key={index} data-lang={file.language} data-file={file.id}>
            <div className="form-group">
              <label className="file-input-label">File Name</label>
              <input type="text" className="form-control" id={"file-title-" + file.id} defaultValue={file.title} />
            </div>
            <div className="form-group">
              <select className="form-control" id={"file-lang-" + file.id}>
                <option value="javascript">Javascript</option>
                <option value="php">PHP</option>
              </select>
            </div>
            <div className="form-group">
              <label className="file-input-label">File Description</label>
              <input type="text" className="form-control" id={"file-desc-" + file.id} defaultValue={file.description} />
            </div>
            <div className="form-group">
              <CodeMirror ref={"fileEditor" + file.id} className={"file-editor-" + file.id} value={file.code} onChange={this.save} options={options} />
            </div>
            <hr/>
          </div>
        )
      });
    }
    

    // Handle case where the response is not here yet
    if ( !this.state.current_snippet ) {
      return (<div className="snippet-edit-react-renderer"><h2>No Snippet Loaded</h2></div>);
    } else {
      return (
        <div className="snippet-edit-react-renderer">
          <h2>{this.state.current_snippet.title}</h2>
          <p>{this.state.current_snippet.description}</p>
          <hr/>
          <div id="files-container">
          {files_arr}
          </div>
        </div>
        );
    }
  }
}

export default EditPane;
