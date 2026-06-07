// Limites de alerta para o sensor IR, configuráveis via .env
// Valores padrão: mínimo 500, máximo 3000
export const Limites = {
  IR_MAXIMO: Number(process.env.IR_THRESHOLD_MAX) || 3000,
  IR_MINIMO: Number(process.env.IR_THRESHOLD_MIN) || 500
}