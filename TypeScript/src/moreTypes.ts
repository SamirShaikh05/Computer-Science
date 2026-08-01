let response : any = "42"

let numericLength : number = (response as string).length

type Book = {name : string}

let bookString = '{"name":"who moved my cheese"}'

let bookObj = JSON.parse(bookString) as Book
console.log(bookObj.name)

// const inputElement = document.getElementById('username') as HTMLInputElement


type Role = "admin" | "user" | "superAdmin";

function redirect(role : Role) : void{
    if(role === "admin"){
     console.log('jdsflksnfdlks');
     return
    }
    else if(role === 'user'){
        console.log('sfkjshfkjws');
        return;
    }
    role;
}


function neverReturn():never{
    while(true){
        
    }
}