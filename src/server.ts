import app from './app';
import { get } from 'env-var';

const PORT = get('PORT').default(7001).asIntPositive();

app.listen(PORT, () => {
  console.log(`ATM service running on port ${PORT}`);
});
