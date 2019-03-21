import React from 'react'
import { post } from 'axios'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      file: null,
      text: ''
    }
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
  }
  onFormSubmit (e) {
    e.preventDefault() // Stop form submit
    this.fileUpload(this.state.file).then(response => {
      this.setState({ text: response.data })
    })
  }
  onChange (e) {
    this.setState({ file: e.target.files[0] })
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
          <h1>OCR Web App</h1>
          <input type='file' onChange={this.onChange} />
          <button type='submit'>Upload</button>
          <br />
          <br />
          <textarea id='txt-1' rows='28' cols='100' value={this.state.text}>
            {' '}
          </textarea>
        </form>
      </center>
    )
  }
}

export default App
