import 'dotenv/config'
import * as admin from 'firebase-admin'

// Inicializa o Firebase Admin SDK com as credenciais da conta de serviço
// e a URL do Realtime Database definida no .env
admin.initializeApp({
  credential: admin.credential.applicationDefault(), // usa o arquivo serviceAccountKey.json via GOOGLE_APPLICATION_CREDENTIALS
  databaseURL: process.env.FIREBASE_DATABASE_URL     // ex: https://seu-projeto.firebaseio.com
})

export default admin