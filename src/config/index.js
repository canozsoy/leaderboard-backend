import path from 'path';
import dotenv from 'dotenv';

const dirname = path.resolve();
dotenv.config({ path: path.join(dirname, 'src/config/.env') });
console.log(`Environment variables are: ${JSON.stringify(process.env, null, 2)}`);
