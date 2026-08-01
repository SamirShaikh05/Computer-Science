let tea: {
    name: string;
    price:number,
    isHot:boolean
}

tea = {
    name:'adrak chai',
    price:20,
    isHot:true
}

type Cup = {size:string}

let smallCup : Cup = {size:'100ml'}
let largeCup = {size:'300ml', material:'steel'}
smallCup=largeCup


// type Chai = {
//     name:string,
//     price:number,
//     isHot:boolean
// }

const updateChai = (updates : Partial<Chai>) =>{
    console.log("updating chai with", updates)
}

updateChai({price:25})


type ChaiOrder = {
    name?:string,
    quantity?:number
}

const placeOrder = (order : Required<ChaiOrder>) => {
    console.log(order);
    
}

placeOrder({name:'masala chai', quantity:10})

type Chai = {
    name:string,
    price:number,
    isHot:boolean,
    ingredients:string[]
}

type BasicChaiInfo = Pick<Chai, "name" | "price">;

const chaiInfo : BasicChaiInfo = {
    name:'lemon tea',
    price:10
}

type publcChai = Omit<Chai, "ingredients">
