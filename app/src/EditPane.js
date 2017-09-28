import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import swal from 'sweetalert2'
import axios from 'axios';
var CodeMirror = require('react-codemirror'); // React component for CodeMirror IDE

// Language support is loaded from here (from the codemirror node package directly)
import '../node_modules/codemirror/mode/javascript/javascript';
import '../node_modules/codemirror/mode/php/php';

// Seperate component to render file forms and keep their own independent states
class FileForm extends Component {
  constructor(){
    super();

    // Pass props into state
    this.state = {
      file_name: '',
      file_description: '',
      file_lang: '',
      file_code: ''
    }

    contextTypes: 

    // Bind events to this component
    this.nameChange = this.nameChange.bind(this);
    this.descChange = this.descChange.bind(this);
    this.langChange = this.langChange.bind(this);
    this.codeChange = this.codeChange.bind(this);
  }

  nameChange(event) {
    this.setState({file_name: event.target.value});
  }
  descChange(event) {
    this.setState({file_desc: event.target.value});
  }
  langChange(event) {
    this.setState({file_lang: event.target.value});
  }
  codeChange(event) {
    this.setState({file_code: event}); // Since I'm using the codemirror-react component, just need the event

    console.log("Code is being edited: ", event);
  }

  // When component props recieved, set state to equal props
  componentWillReceiveProps() {
    this.setState({ 
      file_name: this.props.filename,
      file_description: this.props.filedesc,
      file_lang: this.props.filelang,
      file_code: this.props.filecode
    });

    //console.log(this.state.file_code)
  }

  componentDidMount() {
    //console.log("Props in component: ", this.props.editorRef)
    //{"fileEditor" + this.props.fileid}
  }

  render(){
    //console.log("State for fileform: ", this.state)
    var file_lang = 'language-' + this.props.filelang;
    var options = {
      mode: this.props.filelang,
      lineNumbers: true
    }

    // Use props passed into component to quickly get values, and bind input to component state 
    return (
      <div className="file-section" data-lang={this.state.file_lang} data-file={this.props.fileid}>
        <div className="form-group">
          <label className="file-input-label">File Name</label>
          <input type="text" className="form-control" id={"file-title-" + this.props.fileid} value={this.state.file_name} onChange={this.nameChange} />
        </div>
        <div className="form-group">
          <select className="form-control" id={"file-lang-" + this.props.fileid}>
            <option value="javascript">Javascript</option>
            <option value="php">PHP</option>
          </select>
        </div>
        <div className="form-group">
          <label className="file-input-label">File Description</label>
          <input type="text" className="form-control" id={"file-desc-" + this.props.fileid} value={this.state.file_desc} onChange={this.descChange} />
        </div>
        <div className="form-group">
          <CodeMirror ref={this.props.editorRef} className={"file-editor-" + this.props.fileid} value={this.props.filecode || '# Enter some code...'} onChange={this.codeChange} options={options} />
        </div>
        <hr/>
      </div>
    )
    // Pass ref to child component to refer to it using a custom ref called editorRef, and use regular ref inside the component
  }
}

class EditPane extends Component {
  // Lets create the state by initializing the constructor
  constructor(){
    super(); // Super is the context of the state in the component
    
    // Create the state
    this.state = {
      current_snippet: '',
      current_files: '',
      loaded: false
    };
  }

  // Use React's context api to access child component data
  

  // Fetch all snippets
  fetchSelf(id) {
    var api = 'http://localhost:8000/snippet/' + id;
    var token = '81aaaac4ad188dab4aa27038abc21ea03268d08b';
    var authOptions = { 'Authorization': 'Token ' + token }
    axios.get(api, {headers: authOptions})
      .then(res => {
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

    // Get data from UI, save files first
    var files = document.getElementsByClassName('file-section');

    // Update existing files
    for (var i = 0; i < files.length; i++) {
      var file_name = document.getElementById('file-title-' + this.state.current_snippet.files[i].id).value;
      var file_desc = document.getElementById('file-desc-' + this.state.current_snippet.files[i].id).value;
      /*
      var codemirror_ref = Object.values(this.refs)[i]; // Get the object values directly, to use the function
      console.log("Current id: ", this.state.current_snippet.files[i].id)
      console.log("codemirror_ref: ", document.getElementsByClassName('file-editor-' + this.state.current_snippet.files[i].id));
      //var file_code = codemirror_ref.getCodeMirror().getValue() // That is ugly :o - have to use refs, then get the key of the refs
      console.log("File_code: ", codemirror_ref[0].querySelector('textarea'));
      var file_code = codemirror_ref["0"];
      
      console.log("To be saved: ", file_name, " ,", file_desc, " ,", file_code)
      this.saveFile(this.state.current_snippet.files[i].id, file_name, file_desc, 'php', file_code) // Just save the first snippet for testing
      */
     
      // Just get the refs working first
      console.log('Context: ', this.child.getCodeMirror().getValue()); // So fucking close.
      
    }
    // Update snippet info (snippet title, and description)

    this.forceUpdate(); // Rerender
  }

  createFile() {
    var api = 'http://localhost:8000/files/';
    var token = '81aaaac4ad188dab4aa27038abc21ea03268d08b';
    var authOptions = { 'Authorization': 'Token ' + token }

    // Create a file here using axios post and swal!
    axios.post(api, {
      'title': '',
      'description': '',
      'language': 'none', // This field is required, so set to none
      'snippet_id': this.state.current_snippet.id, // Just set the snippet ID, leave the fields empty to be set by the user
      'code': ''
      }, {headers: authOptions}).then(() => {
        swal(
          'File Created',
          '',
          'success'
        )
        this.fetchSelf(this.state.current_snippet.id) // Refetch self to display new file in real-time
      }).catch(function (error) {
        console.log(error);
        swal(
        'Oops...',
        'Could not save file. Error: ' + error,
        'error'
      )
    });

    this.render(); // Rerender
  }

  deleteFile(id) {
    // Run delete with axios
    var api = 'http://localhost:8000/file/' + id;
    var token = '81aaaac4ad188dab4aa27038abc21ea03268d08b';
    var authOptions = { 'Authorization': 'Token ' + token }
    axios.delete(api, {headers: authOptions}).then(() => {
        swal(
          'File Deleted',
          'Your selected file has been deleted.',
          'success'
        )
      }).catch((error) => {
        console.log(error);
        swal(
        'Oops...',
        'Could not delete file. Error: ' + error,
        'error'
      )
    });
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
    //console.log(this.state)
  }

  render() {
    // Empty array to hold files
    var files_arr = [];

    // If state for current snippet not set, retrieve the snippet
    if ( !this.state.current_snippet ) {
      this.fetchSelf(this.props.currentSnippet);
    }

   // If current_snippet state set, map files
    if ( this.state.current_snippet ) {
      this.state.current_snippet.files.map((file, index) => {
        // The file to save to will be placed inside as an html-attrib 'data-file', use this to find the referring file.
        // Append file component to dynamically bind two-way data with all those fields
        files_arr.push(<FileForm editorRef={ref => (this.child = ref)} key={index} fileid={file.id} filename={file.title} filedesc={file.description} filelang={file.language} filecode={file.code} />);
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
            <div className="form-group text-center">
              <button className="btn btn-large btn-default" id="addfile-primary" onClick={this.createFile.bind(this, this.state.current_snippet)}>
                <span className="icon icon-plus-circled"></span>&nbsp;&nbsp;Add a new file
              </button>
            </div>
          </div>
        </div>
        );
    }
  }
}

export default EditPane;
