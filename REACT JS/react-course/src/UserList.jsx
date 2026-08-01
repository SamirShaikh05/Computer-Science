

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";


function UserList() {
    const [userdata, setUserdata] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate=useNavigate()
    useEffect(() => {
        setLoading(true)
        data();
    }, [])
    function Navigate(id){
        navigate("/Edit/"+id)
    }

    async function data() {
        let response = await fetch("http://localhost:3000/users");
        response = await response.json()
        setUserdata(response)
        setLoading(false)
    }
    async function deleteData(id) {
        let response = await fetch("http://localhost:3000/users"+"/"+id,
            {
                method: "DELETE",
            }
        )
        response = await response.json()
        if(response){
            data()
        }
    }
    return (
        <div>
            <ul className="flex justify-around text-xl border-2 p-3">
                <li>Name</li>
                <li>Age</li>
                <li>E-Mail</li>
                <li>Action</li>
            </ul>
            {
                !loading ?
                    userdata.map((user) =>
                        <ul className="flex justify-around border-1 p-3" key={user.id}>
                            <li>{user.name}</li>
                            <li>{user.age}</li>
                            <li>{user.email}</li>
                            <li>
                            <button className="border-2 rounded bg-slate-300 p-1 m-1" onClick={()=>deleteData(user.id)}>Delete</button>
                            <button className="border-2 rounded bg-slate-300 p-1 m-1" onClick={()=>Navigate(user.id)}>Edit</button>
                            </li>
                        </ul>
                    ) : <h1>Loading...</h1>
            }
        </div>
    )
}
export default UserList;