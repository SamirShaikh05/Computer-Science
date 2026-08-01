import express from 'express';
import { formatCurrency } from '../../shared/formatCurrency.js'

const app = express();

app.get("/", (req, res) => {
  const product = {
    name: "Mechanical Keyboard",
    price: 129.99,
    formattedPrice: formatCurrency(129.99),
  };

  return res.json(product);
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
