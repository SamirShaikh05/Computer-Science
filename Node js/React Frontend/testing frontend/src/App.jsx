import { useEffect } from "react";

export default function App(){
  useEffect(()=>{
   getUser();
  },[])
 async function getUser(){
  let data = await fetch('http://localhost:3000/');
  data = await data.json();
  console.log(data);
 }
 return(
  <>
  <h1>It is working</h1>
  </>
 )
}