import { db } from '../database/mysqlClient'

// Insere uma nova leitura do sensor IR no banco de dados com seu respectivo status
export const salvarLeitura = async (valor: number, status: string) => {
  await db.execute(
    'INSERT INTO leituras_ir (valor, status) VALUES (?, ?)',
    [valor, status]
  )
}

// Retorna todas as leituras registradas ordenadas da mais recente para a mais antiga
export const buscarLeituras = async () => {
  const [rows] = await db.execute(
    'SELECT * FROM leituras_ir ORDER BY criado_em DESC'
  )
  return rows
}

// Remove todas as leituras do banco de dados
export const limparLeituras = async () => {
  await db.execute('DELETE FROM leituras_ir')
}