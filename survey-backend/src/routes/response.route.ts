import { Router } from 'express';
import { ResponseController } from '../controllers/response.controller';
import { Routes } from '../interface/routed.interface';
import { authenticateToken } from '../middlewares/authenticate-token.middleware';

class ResponseRoute implements Routes {
  public path = '/responses';
  public router = Router();
  public responseController = new ResponseController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/question/:questionId', authenticateToken, this.responseController.getResponseByUserId);
    this.router.post('', authenticateToken, this.responseController.createResponse);
    this.router.put('/:id', authenticateToken, this.responseController.updateResponseById);
    this.router.delete('/:id', authenticateToken, this.responseController.deleteResponseById);
  }
}

export default ResponseRoute;
