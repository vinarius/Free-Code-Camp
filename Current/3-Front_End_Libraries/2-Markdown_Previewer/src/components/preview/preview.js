import React from 'react';
import './preview.css';
import marked from 'marked';

const Preview = ({value}) => {
    const parsedMarkdown = marked(value);
    console.log(parsedMarkdown);
    return (
        <div className="preview-container">
            <p>Preview</p>
            <div id="preview" dangerouslySetInnerHTML={{__html: parsedMarkdown}} className="my-preview">
            </div>
        </div>
    );
}

export default Preview;