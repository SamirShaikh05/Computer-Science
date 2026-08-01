import { useState } from "react";

function AddUser(){
    const [name, setName]=useState("")
    const [age, setAge]=useState("")
    const [email, setEmail]=useState("")

    async function add(){
        if (name && age && email) {
    let response=await fetch("http://localhost:3000/users",
        {
            method: "POST",
            body: JSON.stringify({name, age, email})
        }
    )
    
     response= await response.json();   
     setName("")
     setAge("")
     setEmail("")
    }
    else{
        alert("Please Fill All The Details")
    }
    
    
    }

    return(
        <div className="text-center">
        <h1 className="text-4xl">Add New User</h1>
        <br /><br />
        <input type="text" value={name} placeholder="Enter Name" className="border-2 px-4 rounded" onChange={(event)=>setName(event.target.value)}/>
        <br /><br />
        <input type="text" value={age} placeholder="Enter Age" className="border-2 px-4 rounded" onChange={(event)=>setAge(event.target.value)}/>
        <br /><br />
        <input type="text" value={email} placeholder="Enter E-Mail" className="border-2 px-4 rounded" onChange={(event)=>setEmail(event.target.value)} />   
        <br /><br />
        <button className="border-2 px-4 rounded" onClick={add}>Add User</button>            
        </div>
    )
}
export default AddUser;