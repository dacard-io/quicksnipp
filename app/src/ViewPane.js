import React, { Component } from 'react';
//import swal from 'sweetalert2'
import Prism from 'prismjs' // Syntax highlighting lib

class ViewPane extends Component {


  // After render
  componentDidMount() {
    // Highlight each file with Prism.js
    Prism.highlightAll();
  }

  render() {
    // Empty array to hold files
    var files_arr = [];

    this.props.currentSnippet.files.map((file, index) => {
      var file_lang = 'language-' + file.language;
      files_arr.push(
        <div className="file-section" key={index}>
            <h4>{file.title}</h4>
            <p>{file.description}</p>
            <pre><code className={file_lang}>{file.code}</code></pre>
            <hr/>
        </div>
      )
      console.log("Iterate: ", file)
    });

    return (
      <div className="snippet-react-renderer">
        <h2>{this.props.currentSnippet.title}</h2>
        <p>{this.props.currentSnippet.description}</p>
        <hr/>
        {files_arr}
      </div>
    );
  }
}

export default ViewPane;
