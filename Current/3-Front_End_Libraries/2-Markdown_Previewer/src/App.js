import React, { useState } from 'react';
import './App.css';

// Components
import Editor from './components/editor/editor';
import Preview from './components/preview/preview';

const defaultMarkup = `<h1 id="my-title-is-h1">My title is h1</h1>
<p><em>hello world</em></p>
<p><strong>Preview is bolded</strong></p>
<h2 id="my-sub-header">My sub header</h2>
<p><a href="https://freecodecamp.org">A link to FreeCodeCamp</a></p>
<pre><code>A multiline code segment</code></pre><pre><code>An inline code segment</code></pre><ul>
<li>Eat</li>
<li>Code</li>
<li>Sleep</li>
<li>Repeat</li>
</ul>
<blockquote>
<p>My blockquote</p>
</blockquote>
<p><img src="https://dl.dropbox.com/s/5r01s9ie2g9re1c/MKDesign_Final_v1_BLACK.png?dl=0" alt="Bacon"></p>`;

function App() {
  const [value, setValue] = useState(defaultMarkup);
  return (
    <div className="App">
      <header className="App-header">
        <Editor setValue={setValue}/>
        <Preview value={value}/>
      </header>
    </div>
  );
}

export default App;
