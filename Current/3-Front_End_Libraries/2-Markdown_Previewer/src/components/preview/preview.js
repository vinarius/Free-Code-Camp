import React from 'react';
import './preview.css';
import marked from 'marked';

const Preview = ({value}) => {
    return (
        <div className="preview-container">
            <p>Preview</p>
            <div id="preview" dangerouslySetInnerHTML={{__html: marked(value)}} className="my-preview">
            </div>
        </div>
    );
}

export default Preview;
