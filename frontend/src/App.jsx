import { useState } from 'react'
import './App.css'
import axios from 'axios'
import logo from './assets/logo.png'
import spinner from './assets/spinner.gif';

const lambdaUrl = 'https://tbdjvc4sucooyf3jvfjkmwodqe0twsqu.lambda-url.us-east-2.on.aws/';

async function generateImage(urls, prompt) {
  const response = await axios.post(lambdaUrl, {
    urls,
    prompt,
  });
  return response.data;
}

function App() {
  const [inputUrls, setInputUrls] = useState([
    ''
  ]);
  const [prompt, setPrompt] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);


  async function getImage() {
    console.log('Getting image...');
    setLoading(true);
    try {
      const urls = inputUrls.slice(0, -1);
      if (urls.length > 0 && prompt != '') {
        const output = await generateImage(urls, prompt);
        if (output.success) setUrl(output.url);

        console.log('Success getting image');
      } else {
        setError(true);
      }
    } catch(err) {
      console.log('Error getting image:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function setInputUrl(url, idx) {
    inputUrls[idx] = url;
    setInputUrls([...inputUrls])
  }

  function addNewUrl() {
    if (inputUrls[inputUrls.length - 1] !== '') {
      setInputUrls([...inputUrls, ''])
    }
  }

  return (
    <div id="container">
      <div id="content">
        <div id="header">
          <img src={logo} height="100rem"/>
        </div>

        <div id="inputs">
          <div id='imgCarousel' className={inputUrls.slice(0, -1).length == 0 ? 'hidden' : ''}>
            {inputUrls.slice(0, -1).map((url, idx) => (
              <img
                className="carouselImg"
                onError={() => setInputUrls([...inputUrls.slice(0, idx), ...inputUrls.slice(idx + 1)])}
                src={url}
                key={idx} />
            ))}
          </div>
          <div id="inputUrl">
            <label htmlFor="inputUrl">Reference Image URL:  </label>
              <input
                name="query"
                value={inputUrls[inputUrls.length - 1]}
                onChange={(e) => setInputUrl(e.target.value, inputUrls.length - 1)}
              />
            <button onClick={addNewUrl}>
              Add New Image
            </button>
          </div>

          <div id="prompt">
            <label htmlFor="prompt">Image Generation Prompt:  </label>
            <textarea name="query" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </div>

          <button disabled={loading} onClick={() => getImage()}>
            Generate
          </button>
          {error && <p id="error">Error Generating Image</p>}
        </div>
      </div>

      <div id="output">
        {url != '' && !loading && <img id="image" src={url} /> }
        {loading && <img src={spinner}/>}
      </div>
    </div>
  )
}

export default App
