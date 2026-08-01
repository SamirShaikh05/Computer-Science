import express from 'express'
import {formatCurrency} from '@Monorepo/utils'

const app = express();
const PORT = 5000;

app.get('/', (req, res)=>{
    const str : string = formatCurrency(25.99)
    res.json({formattedCurrency:str})
})

app.listen(PORT, ()=>{
    console.log(`Server started at http://localhost:${PORT}`)
})