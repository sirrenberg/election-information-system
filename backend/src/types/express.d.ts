// types/express.d.ts
declare namespace Express {
  export interface Request {
    user?: any; // Use a more specific type if known
  }
}
