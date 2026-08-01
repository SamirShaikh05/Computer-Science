function wrapInArray <T> (item:T) : T[]{
    return [item]
}

wrapInArray("samir")
wrapInArray(35)
wrapInArray({flavour:'adrak'})

function pair <A,B> (a:A, b:B) : [A,B]{
    return [a,b]
}

pair("samir", 12)


interface Box<T>{
    content:T
}

const numberBox : Box<number> = {content:30}
const stringBox : Box<string> = {content:"samir"}

interface ApiPromise<T>{
    status:number,
    data:T
}

const res : ApiPromise<{flavour:string}> = {
    status:200,
    data:{flavour:"masala"}
}