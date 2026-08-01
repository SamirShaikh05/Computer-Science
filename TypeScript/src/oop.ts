class Chai{
    flavour:string;
    price: number

    constructor(flavour:string, price:number){
        this.flavour=flavour;
        this.price=price
    }
}

const masalaChai = new Chai("Ginger", 20)
masalaChai.flavour="masala"


class Shop{
    protected shopName = "Chai corner"
}

class Branch extends Shop{
    getName(){
        return this.shopName
    }
}

new Branch().getName
