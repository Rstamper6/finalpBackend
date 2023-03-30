import { ObjectId } from "mongodb";
// import BoardPost from './boardPost';

export default interface Board {
    _id: ObjectId,
    user: object,
    name: string,
    dob: string,
    dod: string,
    obituary: string,
    img?: string,
    boardPosts: BoardPost[]
}

export interface BoardPost {
    _id: ObjectId,
    user: User,
    boardId: string,
    from: string,
    text: string,
    file?: string,
    
}

export interface User {
    uid: string,
    email: string,
    emailVerified: boolean,
    displayName: string
    isAnonymous: boolean,
    photoURL: string,
    providerData: providerData[],
    stsTokenManager: stsTokenManager,
    createdAt: string,
    lastLoginAt: string,
    apiKey: string,
    appName: string
}

interface providerData {
    providerId: string,
    uid: string,
    displayName: string,
    email: string
    phoneNumber: string | null
    photoURL: string
}

interface stsTokenManager {
    refreshToken: string,
    accessToken: string,
    expirationTime: number
}