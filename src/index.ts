import { Hono } from 'hono';
import awsRoutes from './aws/index';

const app = new Hono();

app.route('/aws', awsRoutes)

export default app;