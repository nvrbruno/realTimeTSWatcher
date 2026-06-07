import admin from 'firebase-admin'
import { salvarLeitura } from '../repository/sensorRepository'
import { Limites } from '../enums/thresholds'
import { logger } from '../utils/logger'

// Armazena o último valor recebido para evitar salvar leituras duplicadas
let ultimoValor: number | null = null

// Armazena o timestamp do último registro salvo no banco
let ultimoSalvo: number = 0

// Intervalo mínimo entre salvamentos: 1 minuto
const INTERVALO_MINIMO = 60 * 1000

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_DATABASE_URL
})

export const iniciarListenerIR = () => {
  logger.info('Listener IR iniciado')

  // Escuta em tempo real o nó /sensores/ir no Firebase Realtime Database
  const ref = admin.database().ref('/sensores/ir')

  ref.on('value', async (snapshot) => {
    const valor = snapshot.val()

    if (valor === null) return

    logger.info(`Valor IR recebido: ${valor}`)

    const agora = Date.now()
    const valorMudou = valor !== ultimoValor
    const passouIntervalo = agora - ultimoSalvo >= INTERVALO_MINIMO

    // Só salva se o valor mudou E o intervalo mínimo passou
    if (!valorMudou || !passouIntervalo) return

    let status = 'normal'

    // Verifica se o valor ultrapassou o limite máximo
    if (valor > Limites.IR_MAXIMO) {
      status = 'acima'
      logger.aviso(`Valor ACIMA do limite: ${valor} > ${Limites.IR_MAXIMO}`)
    }

    // Verifica se o valor ficou abaixo do limite mínimo
    if (valor < Limites.IR_MINIMO) {
      status = 'abaixo'
      logger.aviso(`Valor ABAIXO do limite: ${valor} < ${Limites.IR_MINIMO}`)
    }

    await salvarLeitura(valor, status)
    ultimoValor = valor
    ultimoSalvo = agora
    logger.info(`Salvo no banco: ${valor} (${status})`)
  })
}