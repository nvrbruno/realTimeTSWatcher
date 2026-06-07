#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// -------------------------------------------------
// Configurações WiFi — substitua com sua rede
// -------------------------------------------------
#define WIFI_SSID     "sua_rede"
#define WIFI_PASSWORD "sua_senha"

// -------------------------------------------------
// Configurações Firebase — disponíveis no console
// Configurações do projeto → Geral → Chave da API Web
// -------------------------------------------------
#define API_KEY      "sua_api_key"
#define DATABASE_URL "https://seu-projeto.firebaseio.com"

// -------------------------------------------------
// Pino do sensor IR no ESP32
// Pinos analógicos disponíveis: 32, 33, 34, 35, 36, 39
// -------------------------------------------------
#define SENSOR_IR 34

// Objetos necessários para autenticação e comunicação com o Firebase
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Armazena a leitura analógica do sensor IR (0 a 4095 no ESP32)
int leituraIR;

// Controle de tempo para envio periódico ao Firebase
unsigned long ultimoEnvio = 0;
const unsigned long intervaloEnvio = 1000; // envia a cada 1 segundo

// Protótipos das funções
void lerIR();
void conectarWifi();
void configurarFirebase();
void enviarFirebase();

void setup() {
    Serial.begin(115200);
    pinMode(SENSOR_IR, INPUT);
    conectarWifi();
    configurarFirebase();
}

void loop() {
    lerIR();
    Serial.println(leituraIR);

    // Envia ao Firebase apenas quando o intervalo mínimo for atingido
    if (millis() - ultimoEnvio >= intervaloEnvio) {
        enviarFirebase();
        ultimoEnvio = millis();
    }

    delay(100);
}

// Realiza a leitura analógica do sensor IR
void lerIR() {
    leituraIR = analogRead(SENSOR_IR);
}

// Conecta o ESP32 à rede WiFi e aguarda a conexão ser estabelecida
void conectarWifi() {
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Conectando ao WiFi");
    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(500);
    }
    Serial.println("\nWiFi conectado");
}

// Configura e inicializa o Firebase com autenticação anônima
void configurarFirebase() {
    config.api_key = API_KEY;
    config.database_url = DATABASE_URL;
    config.token_status_callback = tokenStatusCallback; // monitora status do token

    Firebase.signUp(&config, &auth, "", ""); // autenticação anônima
    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true); // reconecta automaticamente se perder WiFi
}

// Envia o valor atual do sensor IR para o Firebase Realtime Database
void enviarFirebase() {
    if (Firebase.ready()) {
        String path = "/sensores/ir";
        Firebase.RTDB.setInt(&fbdo, path.c_str(), leituraIR);
    }
}