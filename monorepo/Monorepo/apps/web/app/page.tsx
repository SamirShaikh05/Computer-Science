import {formatCurrency} from '@Monorepo/utils'

export default function Home() {
  const formattedCurrency = formatCurrency(25.99);
  return (
    <div>
        <p>{formattedCurrency}</p>
    </div>
  );
}
