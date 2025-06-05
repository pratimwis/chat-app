import express from 'express';
import { testController } from '../controllers/test.controller';
import { testMiddeware } from '../middlewares/test.middleware';

const testRouter = express.Router();


testRouter.get('/',testMiddeware, testController);

export default testRouter;