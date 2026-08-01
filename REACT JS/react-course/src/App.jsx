// import AddUser from "./AddUser";
// import UserList from "./UserList";
// import Edit from "./Edit";
// import { Routes, Route , Link } from "react-router";

// import { useState } from "react";

// import { useReducer } from "react";

// function App() {
// return(
//   <div className="m-10">
//      <Link to="/" className="text-2xl mx-2 p-1 text-blue-600" >List</Link>
//      <Link to="/AddUser" className="text-2xl mx-2  p-1 text-blue-600" >Add User</Link>
//      <br /><br />
//     <Routes>
//       <Route path="/" element={<UserList />} />
//       <Route path="/AddUser" element={<AddUser />} />
//       <Route path="/Edit/:id" element={<Edit />} />
//     </Routes>
//   </div>
// )
// }
// export default App;
// const empty={
//   name:"",
//   password:"",
//   age:"",
//   email:"",
//   contact:""
// }

// function reducer(data, action){
// console.log(action);

  
// return {...data, [action.type]:action.value}
// }

// function App() {
//   const [state,dispatch]=useReducer(reducer,empty)
  
  
//   return (
//     <div>
//       <input className="border-1 rounded p-1" type="text" onChange={(event)=>dispatch({value:event.target.value, type:"name"})} placeholder="Enter Name" />
//       <br /><br />
//       <input className="border-1 rounded p-1" type="text" onChange={(event)=>dispatch({value:event.target.value, type:"password"})} placeholder="Enter Password" />
//       <br /><br />
//       <input className="border-1 rounded p-1" type="text" onChange={(event)=>dispatch({value:event.target.value, type:"age"})} placeholder="Enter Age" />
//       <br /><br />
//       <input className="border-1 rounded p-1" type="text" onChange={(event)=>dispatch({value:event.target.value, type:"email"})} placeholder="Enter email" />
//       <br /><br />
//       <input className="border-1 rounded p-1" type="text" onChange={(event)=>dispatch({value:event.target.value, type:"contact"})} placeholder="Enter Contact" />
//       <br /><br />
//       <ul>
//         <li>Name: {state.name}</li>
//         <li>Password: {state.password}</li>
//         <li>Age: {state.age}</li>
//         <li>Email: {state.email}</li>
//         <li>Contact: {state.contact}</li>
//       </ul>
//     </div>
//   )

// }
// export default App;
// import { use , Suspense} from "react";

//   const fetchData=()=>fetch("https://dummyjson.com/users").then((response)=>response.json());
//   const userResourse=fetchData()
// function App() {
//   return (
//     <div>
//     <h1>use API in React Js</h1>
//     <Suspense fallback={<h1>Loading...</h1>} >
//     <User userResourse={userResourse} />
//     </Suspense>
//     </div>
//   )
  
// }
// export default App;

// function User({userResourse}) {
//   const userData=use(userResourse) 
  
//   return (
//     <div>
//      {
//       userData?.users?.map((item)=>
//         <h1 key={item.id}>{item.firstName}</h1>
//       )
//      }
//     </div>
//   )
  
// }

// function App() {
//   const color=JSON.parse(localStorage.getItem("color"))
//   const[r,setR]=useState(color && color.r ? color.r:0)
//   const[g,setG]=useState(color && color.g ? color.g:0)
//   const[b,setB]=useState(color && color.b ? color.b:0)

//   function save(){
//     localStorage.setItem("color", JSON.stringify({r,g,b}))
//   }

  
//   return (
//     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//       <h1 className="text-4xl font-bold">Color Maker</h1> 
//       <br /><br />
//       <div className="size-55 rounded" style={{backgroundColor:`rgb(${r},${g},${b})`}}></div>
//       <br />
//      <label htmlFor="red" className="font-bold text-red-600 text-xl mx-3">Red</label>
//      <input id="red" type="range" value={r} min={0} max={255} onChange={(event)=>setR(event.target.value)}/>
//            <br /><br />
//      <label htmlFor="green" className="font-bold text-green-600 text-xl mx-3">Green</label>
//      <input id="green" type="range" value={g} min={0} max={255} onChange={(event)=>setG(event.target.value)}/>
//            <br /><br />
//      <label htmlFor="blue" className="font-bold text-blue-600 text-xl mx-3">Blue</label>
//      <input id="blue" type="range" value={b} min={0} max={255} onChange={(event)=>setB(event.target.value)}/>
//            <br /><br />
//            <button onClick={save} className="mx-3 border-1 p-1 rounded bg-slate-300 hover:cursor-pointer hover:bg-slate-400 hover:font-bold">Save Color</button>
//     </div>
//   )
  
// }
// export default App;


