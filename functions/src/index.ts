import * as functions from "firebase-functions";
import express, {Application} from "express";
import cors from "cors";
import { boardRoutes } from './routes/boardRoutes';

const app:Application = express();
app.use(cors());
app.use(express.json());

app.use("/boards", boardRoutes);

export const api = functions.https.onRequest(app);