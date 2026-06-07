import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

// Middleware global de tratamento de erros
// Captura qualquer erro lançado nas rotas e retorna uma resposta padronizada com status 500
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.erro(err.message)
  res.status(500).json({ erro: err.message })
}