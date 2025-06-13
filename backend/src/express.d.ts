import type { UserDocument } from "./models/user.model"; // or the correct type
import type User from "./models/user.model";


declare global {
  namespace Express {
    interface Request {
      user?: typeof User.prototype; 
    }
  }
}