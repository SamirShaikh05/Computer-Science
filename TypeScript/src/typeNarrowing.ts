function getChai(kind : string | number){
    if(typeof kind === 'string'){
        return `Making ${kind} tea`
    }
    return `Making chai no ${kind}`
}


type MasalaChai = {type:"masala", spiceLevel:number}
type GingerChai = {type:"ginger", amount:number}
type ElaichiChai = {type:"elaichi", aroma:number}

type Chai = MasalaChai | GingerChai | ElaichiChai

function MakeChai(order : Chai){
    switch (order.type) {
        case 'elaichi':
            
            break;
    
        default:
            break;
    }
}



function brew(order : MasalaChai | GingerChai){
    if("spiceLevel" in order){

    }
}

// function isStringArray(arr: unknown) : arr is string[]{
    
// }