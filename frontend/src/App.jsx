import { useState } from 'react'
import './App.css'
import axios from 'axios'
import logo from './assets/logo.png'

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

  console.log(inputUrls);


  async function getImage() {
    setLoading(true);
    try {
      const urls = inputUrls.slice(0, -1);
      if (urls.length > 0 && prompt != '') {
        const output = await generateImage(urls, prompt);
        if (output.success) setUrl(output.url);  
      } else {
        setError(true);
      }
    } catch(err) {
      console.log(err);
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

      <div id = "content">

        <div id = "header">
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
          <div id = "inputUrl">
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

          <div id = "prompt">
            <label htmlFor="prompt">Image Generation Prompt:  </label>
            <textarea name="query" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </div>

          <button disabled={loading} onClick={() => getImage()}>
            Generate
          </button>
        </div>
      </div>

      <div id="output">
        {url != '' && !loading &&
          <img id="image" src={url} />
        }
        {loading && 
          <img src={"https://media.discordapp.net/attachments/1210798619045793854/1211207844410560532/output-onlinegiftools_1.gif?ex=65ed5c35&is=65dae735&hm=99bc39ef4efdbafce3f8812b229510953a5b0895da58204d80cdc074c84b098f&=&width=1152&height=864"}/>
        }

      </div>
    </div>
  )
}

export default App
