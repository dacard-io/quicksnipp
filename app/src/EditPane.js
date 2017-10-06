import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import swal from 'sweetalert2'
import axios from 'axios';
var CodeMirror = require('react-codemirror'); // React component for CodeMirror IDE
var config = require('./config'); // Load configs

// Language support is loaded from here (from the codemirror node package directly)
import '../node_modules/codemirror/mode/javascript/javascript';
import '../node_modules/codemirror/mode/php/php';
import '../node_modules/codemirror/mode/cobol/cobol';
import '../node_modules/codemirror/mode/coffeescript/coffeescript';
import '../node_modules/codemirror/mode/clojure/clojure';
import '../node_modules/codemirror/mode/css/css';
import '../node_modules/codemirror/mode/dart/dart';
import '../node_modules/codemirror/mode/python/python';
import '../node_modules/codemirror/mode/django/django';
import '../node_modules/codemirror/mode/dockerfile/dockerfile';
import '../node_modules/codemirror/mode/fortran/fortran';
import '../node_modules/codemirror/mode/erlang/erlang';
import '../node_modules/codemirror/mode/jsx/jsx';
import '../node_modules/codemirror/mode/lua/lua';
import '../node_modules/codemirror/mode/markdown/markdown';
import '../node_modules/codemirror/mode/octave/octave';
import '../node_modules/codemirror/mode/perl/perl';
import '../node_modules/codemirror/mode/powershell/powershell';
import '../node_modules/codemirror/mode/go/go';
import '../node_modules/codemirror/mode/groovy/groovy';
import '../node_modules/codemirror/mode/nginx/nginx';
import '../node_modules/codemirror/mode/ruby/ruby';
import '../node_modules/codemirror/mode/rust/rust';
import '../node_modules/codemirror/mode/sass/sass';
import '../node_modules/codemirror/mode/shell/shell';
import '../node_modules/codemirror/mode/smarty/smarty';
import '../node_modules/codemirror/mode/sql/sql';
import '../node_modules/codemirror/mode/swift/swift';
import '../node_modules/codemirror/mode/twig/twig';
import '../node_modules/codemirror/mode/vb/vb';
import '../node_modules/codemirror/mode/vbscript/vbscript';
import '../node_modules/codemirror/mode/vue/vue';
import '../node_modules/codemirror/mode/xml/xml';
import '../node_modules/codemirror/mode/yaml/yaml';

var logged_in = false;

// Simple login conditional. If token found in localStorage, logged in. This will restrict all AJAX requests.
if (localStorage.getItem("token") !== null) {
  logged_in = true;
}

// Seperate component to render file forms and keep their own independent states
class FileForm extends Component {
  constructor(){
    super();

    // Pass props into state
    this.state = {
      file_name: '',
      file_desc: '',
      file_lang: '',
      file_code: '',
      file_exists: true
    }

    // Bind events to this component
    this.nameChange = this.nameChange.bind(this);
    this.descChange = this.descChange.bind(this);
    this.langChange = this.langChange.bind(this);
    this.codeChange = this.codeChange.bind(this);
    //this.handleDelete = this.handleDelete.bind(this);
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
  }

  // Handle delete for click events on file
  handleDelete(file) {
    // If logged in, proceed
    if (logged_in) {
    
    swal({
      title: 'Delete "' + file.file_name + '"?',
      text: "You won't be able to revert this file!",
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
      var api = config.api.url + '/file/' + file.file_id;
      var token = localStorage.getItem("token");
      var authOptions = { 'Authorization': 'Token ' + token }
      axios.delete(api, {headers: authOptions}).then(() => {
        swal(
          'File Deleted',
          'Your selected file has been deleted.',
          'success'
        )
        // Set current file to not exist, rendering nothing (A little weird but it can work for now
        this.setState({file_exists: false});
      }).catch((error) => {
        console.log(error);
        swal(
          'Oops...',
          'Could not delete file. Error: ' + error,
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
    
    } // End of auth check
  }

  // When component props recieved, set state to equal props
  componentWillReceiveProps() {
    this.setState({ 
      file_id: this.props.fileid,
      file_name: this.props.filename,
      file_desc: this.props.filedesc,
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

    // If file currently exists, render file and data
    if (this.state.file_exists) {
      // Use props passed into component to quickly get values, and bind input to component state 
      return (
        <div className="file-section" data-lang={this.state.file_lang} data-file={this.props.fileid}>
          <div className="form-group">
            <label className="file-input-label">File Name</label>
            <button className="btn btn-mini btn-negative delete-file-btn" data-file={this.props.fileid} onClick={this.handleDelete.bind(this, this.state)}>Delete File&nbsp;&nbsp;<span className="icon icon-trash"></span></button>
            <input type="text" className="form-control" id={"file-title-" + this.props.fileid} value={this.state.file_name} onChange={this.nameChange} />
          </div>
          <div className="form-group">
            <select className="form-control" id={"file-lang-" + this.props.fileid} value={this.state.file_lang} onChange={this.langChange}>
              <option value="" disabled>Choose file language</option>
              <option value="abap">ABAP</option>
              <option value="actionscript">ActionScript</option>
              <option value="ada">Ada</option>
              <option value="apacheconf">Apache Configuration</option>
              <option value="apl">APL</option>
              <option value="applescript">AppleScript</option>
              <option value="arduino">Arduino</option>
              <option value="asciidoc">AsciiDoc</option>
              <option value="aspnet">ASP.NET (C#)</option>
              <option value="autoit">AutoIt</option>
              <option value="autohotkey">AutoHotkey</option>
              <option value="bash">Bash</option>
              <option value="basic">BASIC</option>
              <option value="batch">Batch</option>
              <option value="bison">Bison</option>
              <option value="brainfuck">Brainfuck</option>
              <option value="bro">Bro</option>
              <option value="c">C</option>
              <option value="csharp">C#</option>
              <option value="cpp">C++</option>
              <option value="coffeescript">CoffeeScript</option>
              <option value="crystal">Crystal</option>
              <option value="css">CSS</option>
              <option value="d">D</option>
              <option value="dart">Dart</option>
              <option value="django">Django/Jinja2</option>
              <option value="diff">Diff</option>
              <option value="docker">Docker</option>
              <option value="eiffel">Eiffel</option>
              <option value="elixir">Elixir</option>
              <option value="erlang">Erlang</option>
              <option value="fsharp">F#</option>
              <option value="fortran">Fortran</option>
              <option value="gherkin">Gherkin</option>
              <option value="git">Git</option>
              <option value="glsl">GLSL</option>
              <option value="go">Go</option>
              <option value="graphql">GraphQL</option>
              <option value="groovy">Groovy</option>
              <option value="haml">Haml</option>
              <option value="handlebars">Handlebars</option>
              <option value="haskell">Haskell</option>
              <option value="haxe">Haxe</option>
              <option value="http">HTTP</option>
              <option value="icon">Icon</option>
              <option value="inform7">Inform 7</option>
              <option value="ini">Ini</option>
              <option value="j">J</option>
              <option value="jade">Jade</option>
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
              <option value="jolie">Jolie</option>
              <option value="json">JSON</option>
              <option value="julia">Julia</option>
              <option value="keyman">Keyman</option>
              <option value="kotlin">Kotlin</option>
              <option value="latex">LaTeX</option>
              <option value="less">Less</option>
              <option value="livescript">LiveScript</option>
              <option value="lolcode">LOLCODE</option>
              <option value="lua">Lua</option>
              <option value="makefile">Makefile</option>
              <option value="markdown">Markdown</option>
              <option value="markup">Markup</option>
              <option value="matlab">MATLAB</option>
              <option value="mel">MEL</option>
              <option value="mizar">Mizar</option>
              <option value="monkey">Monkey</option>
              <option value="n4js">N4JS</option>
              <option value="nasm">NASM</option>
              <option value="nginx">nginx</option>
              <option value="nim">Nim</option>
              <option value="nix">Nix</option>
              <option value="nsis">NSIS</option>
              <option value="objectivec">Objective-C</option>
              <option value="ocaml">OCaml</option>
              <option value="opencl">OpenCL</option>
              <option value="oz">Oz</option>
              <option value="parigp">PARI/GP</option>
              <option value="parser">Parser</option>
              <option value="pascal">Pascal</option>
              <option value="perl">Perl</option>
              <option value="php">PHP</option>
              <option value="powershell">PowerShell</option>
              <option value="processing">Processing</option>
              <option value="prolog">Prolog</option>
              <option value="properties">.properties</option>
              <option value="protobuf">Protocol Buffers</option>
              <option value="puppet">Puppet</option>
              <option value="pure">Pure</option>
              <option value="python">Python</option>
              <option value="q">Q</option>
              <option value="qore">Qore</option>
              <option value="r">R</option>
              <option value="jsx">React JSX</option>
              <option value="reason">Reason</option>
              <option value="rest">reST (reStructuredText)</option>
              <option value="rip">Rip</option>
              <option value="roboconf">Roboconf</option>
              <option value="ruby">Ruby</option>
              <option value="rust">Rust</option>
              <option value="sas">SAS</option>
              <option value="sass">Sass (Sass)</option>
              <option value="scss">Sass (Scss)</option>
              <option value="scala">Scala</option>
              <option value="scheme">Scheme</option>
              <option value="smalltalk">Smalltalk</option>
              <option value="smarty">Smarty</option>
              <option value="sql">SQL</option>
              <option value="stylus">Stylus</option>
              <option value="swift">Swift</option>
              <option value="tcl">Tcl</option>
              <option value="textile">Textile</option>
              <option value="twig">Twig</option>
              <option value="typescript">TypeScript</option>
              <option value="vbnet">VB.Net</option>
              <option value="verilog">Verilog</option>
              <option value="vhdl">VHDL</option>
              <option value="vim">vim</option>
              <option value="wiki">Wiki markup</option>
              <option value="xojo">Xojo (REALbasic)</option>
              <option value="yaml">YAML</option>
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
    } else {
      // File does not exist. Render nothing (or empty div) - Holy hell this works really well
      return (<div className="file-section empty"></div>)
    }
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

    // Store files without using state; I keep forgetting React is still just ES2016. You can store stuff normally.
    this.current_files = [];
  }

  // Use React's context api to access child component data
  

  // Fetch all snippets
  fetchSelf(id) {
    // If logged in, proceed
    if (logged_in) {

    var api = config.api.url + '/snippet/' + id;
    var token = localStorage.getItem("token");
    var authOptions = { 'Authorization': 'Token ' + token }
    axios.get(api, {headers: authOptions})
      .then(res => {
        this.setState({ current_snippet: res.data });
        this.setState({ loaded: true });
      }).catch((error) => {
        console.log(error);
      });

    } // end of auth check
  }

  // Save file by give file id, and other data to save
  saveFile(id, title, desc, lang, code) {
    // If logged in, proceed
    if (logged_in) {

    // Perform a patch with axios to update file data
    var api = config.api.url + '/file/' + id; // Concat id to url to utilize API to patch single file
    var token = localStorage.getItem("token");
    var authOptions = { 'Authorization': 'Token ' + token }

    axios.patch(api, {
        'title': title,
        'description': desc,
        'language': lang,
        'code': code
      }, {headers: authOptions}).then((res) => {
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

    } // End of auth check
  }

  // Save snippet by id, and other data to save

  // Save all data in snippet (pass in snippet object from prop)
  saveData(snippet) {
    // For all files that exist, save each of them

    // Get data from UI, save files first
    var files = document.getElementsByClassName('file-section');

    // Update existing files
    for (var i = 0; i < files.length; i++) {
      var file_name = document.getElementById('file-title-' + this.state.current_snippet.files[i].id).value;
      var file_desc = document.getElementById('file-desc-' + this.state.current_snippet.files[i].id).value;
      var file_lang = document.getElementById('file-lang-' + this.state.current_snippet.files[i].id).value;
      var file_code = this.current_files[i].getCodeMirror().getValue(); // Get the object values directly, from the contextual variable
      
      this.saveFile(this.state.current_snippet.files[i].id, file_name, file_desc, file_lang, file_code) // Just save the first snippet for testing
    }

    this.forceUpdate(); // Rerender
  }

  createFile() {
    // If logged in, proceed
    if (logged_in) {

    var api = config.api.url + '/files/';
    var token = localStorage.getItem("token");
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

    } // End of auth check
  }

  deleteFile(id) {
    // If logged in, proceed
    if (logged_in) {

    // Run delete with axios
    var api = config.api.url + '/file/' + id;
    var token = localStorage.getItem("token");
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

    } // End of auth check
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
        files_arr.push(<FileForm editorRef={ref => (this.current_files[index] = ref)} key={index} fileid={file.id} filename={file.title} filedesc={file.description} filelang={file.language} filecode={file.code} />);
      });
    }
    

    // Handle case where the response is not here yet
    if ( !this.state.current_snippet ) {
      return (<div className="snippet-edit-react-renderer"><h2>No Snippet Loaded</h2></div>);
    } else {
      return (
        <div className="snippet-edit-react-renderer">
          <h2 id="snippet-name">{this.state.current_snippet.title}</h2>
          <p id="snippet-desc">{this.state.current_snippet.description}</p>
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
