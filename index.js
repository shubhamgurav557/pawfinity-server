import express from 'express'; //API Framework
import bodyParser from 'body-parser'; //Parsing Incoming data
import mongoose from 'mongoose'; // handling mongoDB Calls
import cors from 'cors'; //CROSS Browser Sharing
import dotenv from 'dotenv'; //enviroment variables 
import helmet from 'helmet'; // protecting API's
import morgan from 'morgan'; //logging our API Calls
import multer from 'multer';

import generalRoutes from './routes/generalRoutes.js';

dotenv.config();
const app = express();
const upload = multer();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(upload.any());

// Routes

app.use("/general", generalRoutes);

// MongoDB Connection

const PORT = process.env.PORT || 9000;
mongoose.connect(process.env.MONGO_URL, { //Connect to mongo server
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    app.listen(PORT, () => console.log(`Server Running on port ${PORT}`))
}).catch(err => console.log('Server Error ', err))
