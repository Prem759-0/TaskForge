import app, { connectDatabase } from './app.js';

const port = process.env.PORT || 5000;
await connectDatabase();
app.listen(port, () => console.log(`TaskForge API listening on ${port}`));
