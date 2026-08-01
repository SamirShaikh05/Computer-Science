interface ChaiRatings{
    [flavour: string]:number
}

const ratings : ChaiRatings = {
    "masala chai":4.5,
    "elaichi chai":4.8
}

interface User{
    name: string
}
interface User{
    age:number
}

const u : User = {
    name : "Samir",
    age:21
}

interface A{
    a:string
}

interface B{
    b:string
}

interface c extends A,B {}