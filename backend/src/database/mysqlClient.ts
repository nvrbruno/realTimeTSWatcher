import mysql, { Pool } from "mysql2/promise";

// Singleton que garante uma única instância do pool de conexões com o MySQL
class Database {
  private static instance: Database;
  private pool!: Pool;

  // Retorna a instância existente ou cria uma nova caso ainda não exista
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
      Database.instance.createPool();
    }
    return Database.instance;
  }

  // Cria o pool de conexões com as configurações do .env
  private createPool(): void {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_DATABASE || "sensores",
      port: Number(process.env.DB_PORT) || 3306,
      ssl: { rejectUnauthorized: true }, // exige certificado SSL válido na conexão
      waitForConnections: true,          // aguarda conexão disponível ao invés de retornar erro
      connectionLimit: 100,              // máximo de conexões simultâneas no pool
      queueLimit: 0,                     // sem limite de requisições na fila (0 = ilimitado)
    });
  }

  public getPool(): Pool {
    return this.pool;
  }
}

// Exporta diretamente o pool para uso nos repositories
export const db = Database.getInstance().getPool();