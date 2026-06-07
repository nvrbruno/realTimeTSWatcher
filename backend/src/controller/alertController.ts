import { Request, Response } from 'express'
import { buscarLeituras, limparLeituras } from '../repository/sensorRepository'
import { logger } from '../utils/logger'

// Retorna todas as leituras do banco de dados ordenadas pela mais recente
export const statusSensor = async (req: Request, res: Response) => {
  logger.info('Status do sensor consultado')
  const leituras = await buscarLeituras()
  res.json(leituras)
}

// Apaga todas as leituras do banco de dados
export const limparSensor = async (req: Request, res: Response) => {
  await limparLeituras()
  res.json({ mensagem: 'Leituras apagadas com sucesso' })
}