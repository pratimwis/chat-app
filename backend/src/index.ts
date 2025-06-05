import express, { Request, Response ,NextFunction} from 'express';
import dotenv from 'dotenv';
import testRouter from './routes/test.route';
import connectToDatabase from './config/db';
import authRouter from './routes/auth.route';
import AppError from "./utils/appError"; 
import cookieparser from 'cookie-parser';
dotenv.config();


const app = express();
const PORT = process.env.PORT;


app.use(express.json());
app.use(cookieparser());
app.use('/test',testRouter)


app.use('/api/auth',authRouter)




// Global error handler
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    console.log(`Error: ${err.message}`);
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.errorCode || "UNKNOWN_ERROR",
    });
    return;
  }
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    code: "INTERNAL_ERROR"
  });
});


app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

app.listen(PORT, () => {
  connectToDatabase();
  console.log(`Server is running at http://localhost:${PORT}`);
});
