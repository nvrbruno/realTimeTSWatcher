// Utilitário de log com níveis de severidade e timestamp no formato ISO 8601
export const logger = {
  info:  (msg: string) => console.log(`[INFO]  ${new Date().toISOString()} - ${msg}`), // informações gerais
  aviso: (msg: string) => console.warn(`[AVISO] ${new Date().toISOString()} - ${msg}`), // alertas e valores fora do limite
  erro:  (msg: string) => console.error(`[ERRO]  ${new Date().toISOString()} - ${msg}`) // erros críticos
}