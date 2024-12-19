import {useState,useEffect} from 'react'

const Todo = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [editId,setEditId] = useState(-1)
    const [edittitle, setEditTitle] = useState("");
    const [editdescription, setEditDescription] = useState("");
    const [error,setError] = useState("");
    const [message,setMessage] = useState("");
    const apiUrl = "http://localhost:8000"

    const handleSubmit = () => {
        setError("")
        //check inputs
        if(title.trim() !== "" && description.trim() !== ''){

            fetch(apiUrl + '/todos', {
                method: "POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title,description})
            }).then((res) => {
                if(res.ok){
                  //add item to list
                  setTodos([...todos, {title, description}])
                  setMessage("Item added successfully")
                  setTitle("")
                  setDescription("")
                  setTimeout( () => {
                    setMessage('')
                  },3000)
                }else{
                  setError("Unable to create the item")
                }
                
            }).catch( () => {
                setError("Unable to create Todo item")
            })
            
        }
    }
    useEffect(() => {
      getItems()
    },[])

    const getItems = () => {
        fetch(apiUrl+'/todos')
        .then((res) =>  res.json())
        .then((res) =>{
            setTodos(res)
        })
    }
    
    const handleEdit = (item) =>{
      setEditId(item._id); 
      setEditTitle(item.title); 
      setEditDescription(item.description)
    }

    const handleUpdate = () => {
      setError(""); // Clear error messages
      if (edittitle.trim() === "" || editdescription.trim() === "") {
        setError("Title and description cannot be empty");
        return;
      }
    
      fetch(apiUrl + "/todos/" + editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: edittitle, description: editdescription }),
      })
        .then((res) => {
          if (res.ok) {
            // Update item in the todos list
            const updatedTodos = todos.map((item) => {
              if (item._id === editId) {
                return { ...item, title: edittitle, description: editdescription }; // Create a new object
              }
              return item;
            });
            setTodos(updatedTodos); // Update the state
            setMessage("Item updated successfully");
            setTimeout(() => {
              setMessage("");
              setEditDescription("");
              setEditTitle("");
            }, 3000);
            setEditId(-1); // Reset edit state
          } else {
            setError("Unable to update the item");
          }
        })
        .catch(() => {
          setError("Unable to update Todo item");
        });
    };
    
    const handleDelete =(id) => {
      if(window.confirm('Are you sure want to delete?')) {
        fetch(apiUrl+'/todos/'+id ,{
          method:"DELETE"
        })
        .then(() =>{
          const updatedTodos = todos.filter((item) => item._id !== id)
          setTodos(updatedTodos)
        })
      }
    }

    const handleEditCancel = () => {
      setEditId(-1)
    }

  return (
    <>
      <div className='row p-4 bg-success text-light'>
        <h1>To-DO Project</h1>
      </div>
    <div className='row'>
        <h2>Add Item</h2>
        {message && <p className='text-success'>{message}</p>}
      
      <div className='form-group d-flex gap-2'>
        <input placeholder='Title' onChange={ (e) => setTitle(e.target.value)} value={title} className='form-control mx-2' type='text'/>
        <input placeholder='Description' onChange = {(e) => setDescription(e.target.value)} value={description} className='form-control' type='text'/>
        <button className='btn btn-dark' onClick={handleSubmit}>Submit</button>
      </div>
      {error && <p className='text-danger'>{error}</p>}
    </div>
    <div className='row mt-3'> 
        <h3>Tasks</h3>
        <div className='col-md-6 '>
        <ul className='list-group'>
  {
    todos.map((item) => (
      <li key={item._id} className='list-group-item  d-flex align-item-center justify-content-between my-3 mx-3 p-2'>
        <div className='d-flex flex-column me-2'>
          {
            editId === -1 || editId !== item._id ? (
              <>
                <span className='fw-bold'>{item.title}</span>
                <span>{item.description}</span>
              </>
            ) : (
              <div className='form-group d-flex gap-2'>
                <input placeholder='Title' onChange={(e) => setEditTitle(e.target.value)} value={edittitle} className='form-control' type='text'/>
                <input placeholder='Description' onChange={(e) => setEditDescription(e.target.value)} value={editdescription} className='form-control' type='text'/>
              </div>
            )
          }
        </div>
        <div className='d-flex gap-2'>
          {editId === -1 || editId !== item._id ? (
            <>
              <button className='btn btn-warning' onClick={() => handleEdit(item)}>Edit</button>
              <button className='btn btn-danger' onClick={() => handleDelete(item._id)}>Delete</button>
            </>
          ) : (
            <>
              <button className='btn btn-success' onClick={handleUpdate}>Update</button>
              <button className='btn btn-danger' onClick={handleEditCancel}>Cancel</button>
            </>
          )}
        </div>
      </li>
    ))
  }
        </ul>
        </div>
    </div>
      
    </>
  )
}

export default Todo
