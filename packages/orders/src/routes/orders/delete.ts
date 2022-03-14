import express, { Request, Response } from 'express';

const router = express.Router();

router.delete('/:id', async (req: Request, res: Response) => {
  res.status(204);
});

export { router as deleteOrderRouter };
