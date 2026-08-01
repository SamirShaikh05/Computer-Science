import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

function Edit() {
    const [name, setName] = useState("")
    const [age, setAge] = useState("")
    const [email, setEmail] = useState("")
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchData() {
            await getData();
        }
        fetchData();
    }, []);

    async function getData() {
        let response = await fetch("http://localhost:3000/users/" + id)
        response = await response.json();
        setName(response.name)
        setAge(response.age)
        setEmail(response.email)
    }

    async function edit() {
        if (name && age && email) {
            let response = await fetch("http://localhost:3000/users/" + id,
                {
                    method: "PUT",
                    body: JSON.stringify({ name, age, email })
                }
            )
            response = await response.json();
            if (response) {
                navigate("/")
            }

        }
        else {
            alert("Please Fill All The Details")
        }
    }

    return (
        <div className="text-center">
            <h1 className="text-4xl">Edit User Details</h1>
            <br /><br />
            <input type="text" value={name} placeholder="Enter Name" className="border-2 px-4 rounded" onChange={(event) => setName(event.target.value)} />
            <br /><br />
            <input type="text" value={age} placeholder="Enter Age" className="border-2 px-4 rounded" onChange={(event) => setAge(event.target.value)} />
            <br /><br />
            <input type="text" value={email} placeholder="Enter E-Mail" className="border-2 px-4 rounded" onChange={(event) => setEmail(event.target.value)} />
            <br /><br />
            <button className="border-2 px-4 rounded" onClick={edit}>Update</button>
        </div>
    )
}
export default Edit;