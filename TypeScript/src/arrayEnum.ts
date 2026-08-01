const chaiFlavour : string[] = ['Adrak', 'Masala']
const chaiPrice : number[] = [10, 15]
const chaiRating : Array<number> = [4.5, 5]

const cities : readonly string[] = ["delhi", "mumbai"]
// cities.push("patna")

let chaiTuple : [number, string]
chaiTuple = [10, 'kulhad chai']

const chaiItems: [name:string, price:number] = ["masala", 10]

enum CupSize{
    SMALL,
    MEDIUM,
    LARGE
}

const size = CupSize.MEDIUM