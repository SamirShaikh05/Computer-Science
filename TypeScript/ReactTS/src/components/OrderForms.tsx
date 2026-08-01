import React, { useState } from "react"


interface OrderFormsProps{
    onSubmit(order:{name:string, cups:number}) : void
}

export function OrderForms({onSubmit}:OrderFormsProps){
    const[name, setName] = useState<string>("Masala");
    const[cups, setCups] = useState<number>(1);
   
    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>){
        e.preventDefault();
        onSubmit({name, cups})
    }
    return(
        <form onSubmit={handleSubmit}>
            <label>Chai Name</label>
            <input type="text" placeholder="Enter name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>)=>
                setName(e.target.value)
            }/>
            <label>Cups</label>
            <input type="number" placeholder="Enter name"
            value={cups}
            onChange={(e: React.ChangeEvent<HTMLInputElement>)=>
                setCups(Number(e.target.value)||0)
            }/>
            <button type="submit">PlaceOrder</button>
        </form>
    )
}