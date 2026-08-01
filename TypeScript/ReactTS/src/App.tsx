import './App.css'
import { ChaiCard } from './components/ChaiCard.tsx'
import { Counter } from './components/Counter.tsx'
import type { Chai } from './types.ts'
import { ChaiList } from './components/ChaiList.tsx'
import { OrderForms } from './components/OrderForms.tsx'
import { Card } from './components/Card.tsx'

function App() {
  const menu : Chai[] = [
    {id:1, name:"masala", price:30},
    {id:2, name:"ginger", price:50},
    {id:3, name:"lemon", price:60}
  ]
  return (
    <>
      <section id="center">
        <div>
          <h1>Get started</h1>
          <ChaiCard name="Headphones" price={5000}/>
          <ChaiCard name="Iphone" price={150000}/>
        </div>
        <div>
          <Counter />
        </div>
        <div>
          <ChaiList items={menu}/>
        </div>
        <div>
          <OrderForms onSubmit={(order)=>{
            console.log("placed order", order.name, order.cups)
          }}/>
        </div>
        <div>
          <Card 
          title='chai aur typescript'
          footer={<button>Order Now</button>}/>
        </div>
      </section>
    </>
  )
}

export default App
