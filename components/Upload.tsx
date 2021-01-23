import {useDropzone} from 'react-dropzone';
import {useReducer, useState, useCallback} from 'react';

const Upload = (props) => {
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  const [files, setFiles] = useState([])

  const onDrop = useCallback(acceptedFiles => {
    setFiles([...files, ...acceptedFiles])
  }, [files])

  const { getRootProps, acceptedFiles, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    maxFiles: 1
  })

  const removeFile = file => () => {
    const newFiles = [...files]
    newFiles.splice(newFiles.indexOf(file), 1)
    setFiles(newFiles)
  }

  const removeAll = () => {
    setFiles([])
  }

  const uploadFiles = files.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes{" "}
      <button className="siimple-btn siimple-btn--error" onClick={removeFile(file)}>Remove File</button>
    </li>
  ))

  async function onSubmit(event) {
    event.preventDefault()
    const blob: File = acceptedFiles[0]

    if (!blob) {
      return
    }
    const arrayBuffer = await blob.arrayBuffer()
    const base64String = new Uint8Array(arrayBuffer).reduce(function (data, byte) {
      return data + String.fromCharCode(byte)
    }, '')
  
    console.log('blob: ',blob)
    await fetch("/api/upload", {
      method: 'POST',
      headers: new Headers({ 
        //'Content-Type': 'application/octet-stream', 
        'token': props.user.token, 
        'name': blob.name}),
      credentials: 'same-origin',
      body: base64String
      // Todo: API resolved without sending a response for /api/upload, this may result in stalled requests.
    })
    .then(res => {
      removeAll()
      console.log('upload responce: ', res)
    })
    .catch(error => {
      console.error('failed to fetch upload', error);
    })
  }

  return (
    <div>
      <section className="container">
        <div {...getRootProps({className: 'dropzone'})}>
          <input {...getInputProps()} />
          <p>Drag and Drop file here</p>
          <button className="siimple-btn siimple-btn--success" type="button" onClick={open}>
            ファイルを選択する
          </button>
        </div>
        <aside>
          <ul>{uploadFiles}</ul>
        </aside>
      </section>
      {uploadFiles.length > 0 && (
        <form onSubmit={onSubmit}>
          <button className="siimple-btn siimple-btn--primary" type="submit">upload</button>
        </form>
      )}
    </div>
  )
}

export default Upload
