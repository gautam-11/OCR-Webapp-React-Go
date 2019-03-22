import React from 'react'
import { post } from 'axios'
import './App.css'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      file: null,
      text: '',
      processText: 'Process'
    }
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
  }
  onFormSubmit (e) {
    e.preventDefault() // Stop form submit
    this.setState({ processText: 'Processing' })
    this.fileUpload(this.state.file).then(response => {
      this.setState({ text: response.data })
      this.setState({ processText: 'Process' })
    })
  }
  onChange (e) {
    this.setState({ file: e.target.files[0] })
    document.getElementById('chooseBtn').innerText = e.target.files[0].name
  }
  fileUpload (file) {
    const url = 'http://localhost:8080/upload'
    const formData = new FormData()
    formData.append('file', file)
    console.log(formData)
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    return post(url, formData, config)
  }

  render () {
    return (
      <center>
        <form onSubmit={this.onFormSubmit}>
          <h1>Extract Text From Image</h1>
          <label htmlFor='hiddenBtn' className='choose-btn' id='chooseBtn'>
            Browse
          </label>
          <input
            type='file'
            name='file'
            id='hiddenBtn'
            onChange={this.onChange}
          />
          <button className='button' type='submit'>
            {this.state.processText}
          </button>
          <textarea
            readOnly
            id='txt-1'
            rows='20'
            cols='150'
            value={this.state.text}
          >
            {' '}
          </textarea>
        </form>
      </center>
    )
  }
}

export default App
