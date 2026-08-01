import { Link } from "react-router"

export default function User() {
    const userData = [
        { id: 1, name: "Samir" },
        { id: 2, name: "Aamir" },
        { id: 3, name: "Jabir" },
        { id: 4, name: "Zafer" },
        { id: 5, name: "Aryan" },
        { id: 6, name: "Azaan" },
        { id: 7, name: "Jamil" },
    ]
    return (
        <div>
            <h1>User Details Page</h1>
            {
                userData.map((item)=>
                    <div>
                    <Link className="Link" to={"/User/"+item.id}>{item.name}</Link>
                    </div>
                )
            }
        </div>
    )
}
