import express, { Request, Response } from "express";
import { getClient } from "../db";
import Board from "../models/board";
import { ObjectId } from "mongodb";
import { BoardPost } from '../models/board';

export const boardRoutes = express.Router();

boardRoutes.get("/", async (req: Request, res: Response) => {
  //getting all the data form the database
  try {
    const client = await getClient();
    const results = await client
      .db("gravebook")
      .collection<Board>("boards")
      .find()
      .toArray();

    return res.status(200).json(results);
  } catch (error) {
    console.log(error);

    return res.status(500).send(error);
  }
});

boardRoutes.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  //getting everything that matches a certain
  try {
    const client = await getClient();
    const result = await client
      .db("gravebook")
      .collection<Board>("boards")
      .findOne({ _id: new ObjectId(id) });

    if (!result) {
      return res.status(404).send("Board not found");
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).send(error);
  }
});

boardRoutes.post("/", async (req: Request, res: Response) => {
  const board = req.body as Board;

  try {
    const client = await getClient();

    await client.db("gravebook").collection<Board>("boards").insertOne(board);

    return res.status(201).json(board);
  } catch (error) {
    return res.status(500).send(error);
  }
});

boardRoutes.get("/boardposts/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const client = await getClient();
    const result = await client
      .db("gravebook")
      .collection("posts")
      .find({ boardId: id })
      .toArray();

    if (!result) {
      return res.status(404).send("Board not found");
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).send(error);
  }
});

boardRoutes.post("/boardposts/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  const board = {
    boardId: id,
    user: req.body.user,
    from: req.body.from,
    text: req.body.text,
    file: req.body.file,
  } as BoardPost;
  // const board = req.body as BoardPost;

  try {
    const client = await getClient();

    await client
      .db("gravebook")
      .collection<BoardPost>("posts")
      .insertOne(board);

    return res.status(201).json(board);
  } catch (error) {
    return res.status(500).send(error);
  }
});

boardRoutes.delete("/boardposts/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const client = await getClient();
    const result = await client
      .db("gravebook")
      .collection<BoardPost>("posts")
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Not Found" });
    } else {
      return res.status(204).end();
    }
  } catch (error) {
    console.error("Could not complete", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

boardRoutes.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const client = await getClient();
    const result = await client
      .db("gravebook")
      .collection<Board>("boards")
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Not Found" });
    } else {
      return res.status(204).end();
    }
  } catch (error) {
    console.error("Could not complete", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

boardRoutes.get("/boards/:name", async (req: Request, res: Response) => {
  const name = req.params.name;
  try {
    const client = await getClient();
    const result = await client
      .db("gravebook")
      .collection<Board>("boards")
      .find({ name: name })
      .toArray();

    if (!result) {
      return res.status(404).send("Name not found");
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).send(error);
  }
});

boardRoutes.get("/user/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const client = await getClient();
    const result = await client
      .db("gravebook")
      .collection<BoardPost>("posts")
      .find({ "user.uid": id })
      .toArray();

    if (!result) {
      return res.status(404).send("Boards not found");
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).send(error);
  }
});
