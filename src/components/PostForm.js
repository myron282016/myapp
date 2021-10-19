import { useState } from 'react'

export default function PostForm ({ addNote }) {
  const [data, setData] = useState({})

  function onChange (event) {
    const newData = { ...data, [event.target.name]: event.target.value }

    setData(newData)
  }

  function onSubmit (event) {
    event.preventDefault()

    if (data.title && data.body && data.created_by) {
      const json = JSON.stringify(data)
      console.log('json test:', json)
      fetch("http://localhost:5000/notes", {
        method: "POST", body: json, headers: { 'Content-type': 'application/json' }
      })
        .then((res) => res.json())
        .then((response) => {
          console.log("create test:", response);

          addNote(response)
        })
        .catch((error) => console.log(error));
    } else {
      console.log('invalid form data!')
    }
  }

  return <form onSubmit={onSubmit}>
    <input onChange={onChange} name='title' placeholder='Title' />
    <input onChange={onChange} name='body' placeholder='Body' />
    <input onChange={onChange} name='created_by' placeholder='Author' />

    <button>Create</button>
  </form>
}