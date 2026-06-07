// Interface que representa os dados recebidos do sensor IR
export interface DadosSensor {
  valor: number       // leitura analógica do sensor (0 a 4095 no ESP32)
  timestamp?: number  // momento da leitura em ms (opcional)
}