// import axios from "axios";
// import type { AxiosResponse } from "axios";

// interface Todo{
//     userId:number,
//     id:number,
//     title:string,
//     completed:boolean
// }

// const fetchData = async() =>{
//     try {
//         const res:AxiosResponse<Todo> = await axios.get('https://jsonplaceholder.typicode.com/todos/1')
//         console.log('TODO', res.data)
//     } catch (error: any) {
//         if(axios.isAxiosError(error)){
//             console.log("Axios Error", error.message)
//         }
//     }
// }


import axios from "axios";

interface Todo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

const fetchData = async () => {
    const res = await axios.get<Todo>(
        "https://jsonplaceholder.typicode.com/todos/1"
    );

    console.log(res.data.title);
};