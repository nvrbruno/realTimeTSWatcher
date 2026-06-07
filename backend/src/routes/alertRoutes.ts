import { Router } from 'express'
import { statusSensor, limparSensor } from '../controller/alertController'

const router = Router()

// GET /api/status — retorna todas as leituras do banco de dados
router.get('/status', statusSensor)

// DELETE /api/limpar — apaga todas as leituras do banco de dados
router.delete('/limpar', limparSensor)

export default router