import express, {Request, Response} from "express";
import { getClient } from '../db';
import Board from '../models/board';
import {ObjectId} from "mongodb";

export const boardRoutes = express.Router();

boardRoutes.get("/", async (req:Request, res:Response) => {
    //getting all the data form the database
    try{
        const client = await getClient();
        const results = await client.db("gravebook").collection<Board>("boards").find().toArray();

        return res.status(200).json(results);
    } catch(error){
        console.log(error);

        return res.status(500).send(error);
        
    }
});

boardRoutes.get("/:id", async (req:Request, res:Response) => {
    const id = req.params.id;
    //getting everything that matches a certain
    try{
        const client = await getClient()
        const result = await client.db("gravebook").collection<Board>("boards").findOne({_id: new ObjectId(id)});

        if(!result) {
            return res.status(404).send("Board not found")
        }
        return res.status(200).json(result)
    } catch(error){
        return res.status(500).send(error)
    }
});

boardRoutes.post("/",async (req:Request, res:Response) => {
    const board = req.body as Board;

    try {
        const client = await getClient()

        await client.db("gravebook").collection<Board>("boards").insertOne(board);

        return res.status(201).json(board);
    } catch(error){
        return res.status(500).send(error)
    }
});

boardRoutes.put("/:id",async (res:Response, req:Request) => {
    const id = req.params.id;
    const board = req.body as Board
    delete board._id

    try {
        const client = await getClient()
        const result = await client.db("gravebook").collection<Board>("boards").replaceOne({_id: new ObjectId(id)}, board);

        if(result.modifiedCount === 0){
            return res.status(404).send("Not found");
        }
        else {
            board._id = new ObjectId(id);
            return res.json(board)
        }
    } catch(error) {
        return res.status(500).send(error)
    }
});

boardRoutes.delete("/:id", async (req:Request, res:Response) => {
    const id = req.params.id;
    try {
      const client = await getClient();
      const result = await client.db("gravebook").collection<Board>("boards").deleteOne({_id: new ObjectId(id)});
      if (result.deletedCount === 0) {
        return res.status(404).json({message: "Not Found"});
      } else {
        return res.status(204).end();
      }
    } catch (error) {
      console.error("Could not complete", error);
      return res.status(500).json({message: "Internal Server Error"});
    }
  });