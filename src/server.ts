import app from './app';
import dotenv from 'dotenv';
import connectDB from './config/database/mongodb/mongodb.config';
import './infrastructure/cron-jobs/updateBookingsCron';

dotenv.config();

const port = process.env.PORT || 3000;

connectDB();
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})