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

    const handleUpdate = () =>{
      setError("")
        //check inputs
        if(edittitle.trim() !== "" && editdescription.trim() !== ''){

            fetch(apiUrl + '/todos/' +editId, {
                method: "PUT",
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title:edittitle,description:editdescription})
            }).then((res) => {
                if(res.ok){
                  //update item to list
                   const updatedTodos = todos.map((item) =>{
                    if(item._id == editId){
                      item.title = edittitle;
                      item.description = editdescription;
                    }
                    return item;
                  })
                  setTodos(updatedTodos)
                  setMessage("Item updated successfully")
                  setTimeout( () => {
                    setMessage('')
                  },3000)
                  setEditId(-1)
                }else{
                  setError("Unable to update the item")
                }
                
            }).catch( () => {
                setError("Unable to update Todo item")
            })
            
        }
    }
    const handleDelete =(id) => {
      if(window.confirm('Are you sure want to delete?')) {
        fetch(apiUrl+'/todos/'+id ,{
          method:"DELETE"
        })
        .then(() =>{
          const updatedTodos = todos.filter((item) => item.id !== id)
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
        <input placeholder='Title' onChange={ (e) => setTitle(e.target.value)} value={title} className='form-control' type='text'/>
        <input placeholder='Description' onChange = {(e) => setDescription(e.target.value)} value={description} className='form-control' type='text'/>
        <button className='btn btn-dark' onClick={handleSubmit}>Submit</button>
      </div>
      {error && <p className='text-danger'>{error}</p>}
    </div>
    <div className='row mt-3'> 
        <h3>Tasks</h3>
        <ul className='list-group'>
            {
                todos.map((item) => <li className='list-group-item bg-info d-flex align-item-center justify-content-between my-3'>
                <div className='d-flex flex-column me-2'>
                  {
                    editId == -1 || editId !== item._id ? <>
                    <span className='fw-bold'>{item.title}</span>
                    <span>{item.description}</span>
                    </>:<>
                    <div className='form-group d-flex gap-2'>
                      <input placeholder='Title' onChange={ (e) => setEditTitle(e.target.value)} value={edittitle} className='form-control' type='text'/>
                      <input placeholder='Description' onChange = {(e) => setEditDescription(e.target.value)} value={editdescription} className='form-control' type='text'/>
                      
                    </div>
                    </>
                  }
                   <span className='fw-bold'>{item.title}</span>
                   <span >{item.description}</span>
                </div>
                <div className='d-flex gap-2'>
                  {editId == -1 || editId !== item._id ?  <button className='btn btn-warning' onClick={() => handleEdit(item) }>Edit</button> : <button onClick={handleUpdate}>Update</button>}
                  {editId == -1 ? <button className='btn btn-danger' onClick={handleDelete(item._id)}>Delete</button> :
                   <button className='btn btn-danger' onClick={handleEditCancel}>Cancel</button>}
                </div>
            </li>
             )
            }
            
        </ul>
    </div>
      
    </>
  )
}

export default Todo
