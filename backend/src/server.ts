import 'dotenv/config'
import express from 'express'
import { errorHandler } from './middlewares/errorHandler'
import alertRoutes from './routes/alertRoutes'
import { iniciarListenerIR } from './services/listenerService'
import { logger } from './utils/logger'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// Registra as rotas da API sob o prefixo /api
app.use('/api', alertRoutes)

// Middleware global de tratamento de erros (deve ser o último middleware)
app.use(errorHandler)

app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`)

  // Inicia o listener do Firebase que escuta o sensor IR em tempo real
  iniciarListenerIR()
})