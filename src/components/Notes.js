import React, { useState, useEffect } from "react";
import PostForm from './PostForm'
import UpdateForm from './UpdateForm'

function Notes() {
  const { useState } = React;

  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [updateId, setUpdateId] = useState()
  const [query, setQuery] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  console.log('errorMessage test:', errorMessage)

  useEffect(() => {
    fetch("http://localhost:5000/notes", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        setNotes(response);
        console.log("Reponse", response);

        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error test:", error)
        setErrorMessage(error.message)
      });
  }, [page]);

  const filtered = query 
    ? notes.filter(note => note.created_by.toLowerCase().includes(query.toLowerCase()))
    : notes

  const copy = [...filtered]
  copy.reverse()

  const rows = copy.map((item) => {
    function remove () {
      const url = `http://localhost:5000/notes/${item.id}`
      fetch(url, { method: "DELETE" })
        .then((res) => res.json())
        .then((response) => {
          if (response) {
            const newNotes = notes.filter(note => note.id !== item.id)

            setNotes(newNotes)
          }
        })
        .catch((error) => {
          console.log(error)
          setErrorMessage(error.message)
        });
    }

    function update () {
      setUpdateId(item.id)
    }

    return (
      <tr key={item.id}>
        <td>{item.id}</td>
        <td>{item.title}</td>
        <td>{item.body}</td>
        <td>{new Date(item.created_at).toLocaleString()}</td>
        <td>{item.created_by}</td>
        <td>
          <button onClick={remove}>Remove</button>
        </td>
        <td>
          <button onClick={update}>Update</button>
        </td>
      </tr>
    )
  })

  console.log('rows test:', rows)

  const table = <table>
    <thead>
      <tr>
        <th>Id</th>
        <th>Title</th>
        <th className="body-column">Body</th>
        <th>Created At</th>
        <th>Author</th>
        <th>Delete</th>
        <th>Update</th>
      </tr>
    </thead>
    <tbody>
      {rows}
    </tbody>
  </table>

  function addNote (note) {
    const newNotes = [...notes, note]

    setNotes(newNotes)
  }

  const content = notes.length > 0
    ? table
    : <p>No notes found</p>

  function updateNote (updated) {
    const newNotes = notes.map(note => {
      if (note.id === updated.id) {
        return updated
      }

      return note
    })

    setNotes(newNotes)
  }

  const updating = notes.find(note => note.id === updateId)
  function cancelUpdate () {
    setUpdateId(null)
  }

  const updateForm = updating && <UpdateForm note={updating} updateNote={updateNote} cancelUpdate={cancelUpdate} />

  function onChange (event) {
    setQuery(event.target.value)
  }

  return (
    <div className="App">
      <div id='app-title'>
        <h1>Notes App</h1>

        <PostForm addNote={addNote} />
      </div>

      <input placeholder='Filter by author' onChange={onChange} />

      {content}

      {updateForm}
    </div>
  );
}

export default Notes;
