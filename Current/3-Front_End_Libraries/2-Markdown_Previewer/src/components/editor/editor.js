import React from 'react';
import './editor.css';

function Editor({setValue}) {
    const defaultText = `My title is h1
========

*hello world*

**Preview is bolded**

My sub header
-----------

[A link to FreeCodeCamp](https://freecodecamp.org)

\`\`\`
A multiline code segment
\`\`\`

\`An inline code segment\`

- Eat
- Code
- Sleep
- Repeat

>My blockquote

![Bacon](https://dl.dropbox.com/s/5r01s9ie2g9re1c/MKDesign_Final_v1_BLACK.png?dl=0)`;
    return (
        <div>
            <p>Editor</p>
            <textarea
                onChange={(event) => setValue(event.target.value)}
                className="my-editor"
                id="editor"
                rows="15"
                cols="37"
            >
                {defaultText}
            </textarea>
        </div>
    );
}

export default Editor;