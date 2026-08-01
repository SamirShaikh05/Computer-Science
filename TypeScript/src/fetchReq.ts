interface Todo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}


const fetchData = async () => {
    try {
        const res = await fetch(
        "https://jsonplaceholder.typicode.com/todos/1"
        );

        if(!res.ok){
            throw new Error(`HTTP error ${res.status}`)
        }
        const data : Todo = await res.json();
    } catch (error) {
        
    }
};