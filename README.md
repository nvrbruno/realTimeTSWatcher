# RealTimeTSWatcher

Sistema de monitoramento em tempo real de sensor IR com ESP32, Firebase Realtime Database, Node.js e MySQL.

## Visão Geral

O ESP32 lê continuamente o sensor IR e envia os valores para o Firebase Realtime Database. O backend Node.js escuta essas mudanças em tempo real, aplica regras de negócio (debounce e limites de alerta) e persiste os dados no MySQL.

```
ESP32 → Firebase Realtime DB → Node.js (listener) → MySQL
```

## Tecnologias

- **ESP32** — leitura analógica do sensor IR via WiFi
- **Firebase Realtime Database** — transporte dos dados em tempo real
- **Node.js + TypeScript** — backend com regras de negócio
- **MySQL** — persistência das leituras
- **Express** — API REST para consulta e gerenciamento dos dados

## Estrutura do Projeto

```
realTimeTSWatcher/
├── firmware/
│   └── main.cpp                   # código do ESP32
└── backend/
    └── src/
        ├── config/
        │   ├── firebase.ts            # inicialização do Firebase Admin SDK
        │   └── serviceAccountKey.json # credenciais Firebase (não versionado)
        ├── controller/
        │   └── alertController.ts     # controllers da API REST
        ├── database/
        │   └── mysqlClient.ts         # pool de conexões MySQL (singleton)
        ├── enums/
        │   └── thresholds.ts          # limites mínimo e máximo do sensor IR
        ├── middlewares/
        │   └── errorHandler.ts        # middleware global de erros
        ├── models/
        │   └── sensorData.ts          # interface DadosSensor
        ├── repository/
        │   └── sensorRepository.ts    # queries MySQL (salvar, buscar, limpar)
        ├── routes/
        │   └── alertRoutes.ts         # rotas da API
        ├── services/
        │   └── listenerService.ts     # listener Firebase + lógica de negócio
        ├── utils/
        │   └── logger.ts              # utilitário de log com níveis e timestamp
        └── server.ts                  # entry point da aplicação
```

## Pré-requisitos

- Node.js 18+
- MySQL 8+
- Conta no Firebase com Realtime Database habilitado
- ESP32 com sensor IR configurado
- Arduino IDE ou PlatformIO

## Instalação

```bash
git clone https://github.com/seu-usuario/realTimeTSWatcher.git
cd realTimeTSWatcher/backend
npm install
```

## Configuração

### 1. Variáveis de ambiente

Crie um arquivo `.env` na raiz do backend:

```env
PORT=3000

# MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_DATABASE=sensores
DB_PORT=3306

# Firebase
FIREBASE_DATABASE_URL=https://seu-projeto.firebaseio.com
GOOGLE_APPLICATION_CREDENTIALS=./src/config/serviceAccountKey.json

# Limites do sensor IR
IR_THRESHOLD_MAX=3000
IR_THRESHOLD_MIN=500
```

### 2. Credenciais do Firebase

Acesse o console do Firebase → **Configurações do projeto → Contas de serviço → Gerar nova chave privada** e salve o arquivo como:

```
src/config/serviceAccountKey.json
```

### 3. Banco de dados

Crie a tabela no MySQL:

```sql
CREATE TABLE leituras_ir (
  id INT AUTO_INCREMENT PRIMARY KEY,
  valor INT NOT NULL,
  status VARCHAR(10) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Executando

```bash
# desenvolvimento
npm run dev

# produção
npm run build
npm start
```

## Firmware (ESP32)

O código do ESP32 está em `firmware/main.cpp`.

### Dependências (Arduino IDE / PlatformIO)

- `WiFi.h`
- `Firebase_ESP_Client.h`

### Configuração

No arquivo `firmware/main.cpp`, ajuste as defines:

```cpp
#define WIFI_SSID     "sua_rede"
#define WIFI_PASSWORD "sua_senha"
#define API_KEY       "sua_api_key_firebase"
#define DATABASE_URL  "https://seu-projeto.firebaseio.com"
#define SENSOR_IR     34  // pino analógico do sensor (disponíveis: 32, 33, 34, 35, 36, 39)
```

### Comportamento

- Lê o sensor IR a cada 100ms
- Envia o valor para `/sensores/ir` no Firebase a cada 1 segundo

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/status` | Retorna todas as leituras ordenadas pela mais recente |
| DELETE | `/api/limpar` | Remove todas as leituras do banco |

### Exemplos

```bash
# buscar leituras
curl http://localhost:3000/api/status

# limpar leituras
curl -X DELETE http://localhost:3000/api/limpar
```

## Lógica de Salvamento

O sistema só persiste uma leitura quando **ambas** as condições são atendidas:

- O valor do sensor **mudou** em relação ao último salvo
- Passou pelo menos **1 minuto** desde o último salvamento

Os status possíveis são:

| Status | Condição |
|--------|----------|
| `normal` | `IR_THRESHOLD_MIN` ≤ valor ≤ `IR_THRESHOLD_MAX` |
| `acima` | valor > `IR_THRESHOLD_MAX` |
| `abaixo` | valor < `IR_THRESHOLD_MIN` |

## Variáveis de Ambiente Obrigatórias

| Variável | Descrição |
|----------|-----------|
| `FIREBASE_DATABASE_URL` | URL do Realtime Database |
| `GOOGLE_APPLICATION_CREDENTIALS` | Caminho para o serviceAccountKey.json |
| `DB_HOST` | Host do MySQL |
| `DB_USER` | Usuário do MySQL |
| `DB_PASSWORD` | Senha do MySQL |
| `DB_DATABASE` | Nome do banco de dados |

## Licença

MIT