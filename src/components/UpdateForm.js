import { useState } from 'react'

export default function PostForm ({ updateNote, note, cancelUpdate }) {
  const [data, setData] = useState({})

  function onChange (event) {
    const newData = { ...data, [event.target.name]: event.target.value }

    setData(newData)
  }

  function onSubmit (event) {
    event.preventDefault()

    if (data.title && data.body && data.edited_by) {
      const json = JSON.stringify(data)

      const url = `http://localhost:5000/notes/${note.id}`
      fetch(url, {
        method: "POST", body: json, headers: { 'Content-type': 'application/json' }
      })
        .then((res) => res.json())
        .then((response) => {
          console.log("update test:", response);

          updateNote(response)
        })
        .catch((error) => console.log(error));
    } else {
      console.log('invalid form data!')
    }
  }

  return <form onSubmit={onSubmit}>
    <h3>Update Note #{note.id}</h3>

    <input onChange={onChange} name='title' placeholder='Title' value={note.title} />
    <input onChange={onChange} name='body' placeholder='Body' value={note.body} />
    <input onChange={onChange} name='edited_by' placeholder='Editor' value={note.created_by} />

    <button>Update</button>
    <button type='button' onClick={cancelUpdate}>Cancel</button>
  </form>
}