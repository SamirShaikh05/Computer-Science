export function home(){
    return "<h1>Home Page</h1>  <a href='/login'>Go to Login</a>"
}

export function login(){
    return `<form action="/submit" method="post">
			<input type="text" placeholder="name">
			<br/>
			<br/>
			<input type="password" placeholder="Enter Password">
			<br/>
			<br/>
			<button>Login</button>
			</form>
            <a href='/'>Go to Home</a>
            `
}

export function submit(){
    return "<h1>Data Sumitted</h1> <a href='/'>Go to Home</a>"
}
