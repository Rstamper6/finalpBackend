import { ObjectId } from "mongodb";
// import BoardPost from './boardPost';

export default interface Board {
    _id: ObjectId,
    name: string,
    dob: string,
    dod: string,
    obituary: string,
    img?: string,
    boardPosts: BoardPost[]
}

export interface BoardPost {
    boardId: string,
    from: string,
    text: string,
    file?: string,
    
}