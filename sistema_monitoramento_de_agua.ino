/*
 Nome do Projecto: Sistema de Monitoramento de Reservatórios de Água
 Nome dos Criadores: Aldair Avelino, Alfredo Simão, João Sunda

*/

//Inclusão das Bibliotecas
#include<Wire.h>
#include<Ultrasonic.h>
#include <IRremote.h>
#include<LiquidCrystal_I2C.h>

//Declaraçao da porta do IR

#define receptor 12 //Porta da saída para a entrada digital do Arduino

//Declaração dos pinos do Ultrassonico e valor da distância máxima

#define TRIGGER_PIN  10
#define ECHO_PIN     9
#define MAX_DISTANCE 22.5

//Declaração dos Objectos das Bibliotecas acima

Ultrasonic ultrassonico(TRIGGER_PIN,ECHO_PIN);
LiquidCrystal_I2C lcd(0x27,20,4);
IRrecv receptorIR(receptor); //Criar a classe do IRrecv

decode_results resultado; //Criar um decode_results, para fazer a decodificação do resultado e vai passar o valor do sinal que recebeu

//Declaração de Variáveis e Constantes do ultrassonico e do tanque principal

boolean solicitarAgua = false;
boolean mostrarLitragem = true;
int intervaloMedicao = 150;          //Valor em segundos
unsigned long tempoMedicao;             // Tempo de medição em milisegundos
float distanciaUltrassonicoAgua;    //Distância da água em relaçao ao ultrassonico
float altura;                     //altura da água
float volume;
float litros;
#define ledManutencao 8
#define alturaTanque 22.5        //O tanque tem 22.5cm de altura
#define comprimentoTanque 18.5  // O tanque tem 18.5cm de comprimento
#define larguraTanque 11.5     //O tanque tem 11.5cm de largura

//Declaração de variáveis e constantes do tanque reserva
#define buzzer 3
#define ledReservaVazio 7
boolean estado=true;
boolean falhaSensor1 = false;
boolean tanqueReservaFullest = false;

int tanqueReservaVazio=4;
int tanqueReservaCheio=5;

//Declaração do motor
#define motor 2

//Declaração dos botões e do count
#define btnBuzzer 3
#define btnManutencao 7
int count=0;

byte emojetriste[8] = {
  B00000,
  B10001,
  B00000,
  B00000,
  B01110,
  B10001,
  B00000,
  B00000,
};

byte iconSucesso[8]={
  B00000,
  B00001,
  B00010,
  B10100,
  B01000,
  B00000,
  B00000,
  B00000,
};

byte corpoBateria[8] ={
  B00000,
  B01110,
  B11111,
  B10001,
  B10001,
  B10001,
  B10001,
  B11111,
};

byte bateriaNivel1[8] ={
  B00000,
  B01110,
  B11111,
  B10001,
  B10001,
  B10001,
  B11111,
  B11111,
};

byte bateriaNivel2[8] ={
  B00000,
  B01110,
  B11111,
  B10001,
  B10001,
  B11111,
  B11111,
  B11111,
};

byte bateriaNivel3[8] ={
  B00000,
  B01110,
  B11111,
  B10001,
  B11111,
  B11111,
  B11111,
  B11111,
};

byte bateriaNivel4[8] ={
  B00000,
  B01110,
  B11111,
  B11111,
  B11111,
  B11111,
  B11111,
  B11111,
};

void carregando(){  
  lcd.setCursor(6,3);
  lcd.print("Carregando");
  lcd.setCursor(17,3);
  lcd.print(".");
  delay(1000);
  lcd.setCursor(18,3);
  lcd.print(".");
  delay(1500);
  lcd.setCursor(19,3);
  lcd.print(".");
  delay(1000);

  lcd.setCursor(19,3);
  lcd.print(" ");
  delay(1000);
  lcd.setCursor(18,3);
  lcd.print(" ");
  delay(1500);
  lcd.setCursor(17,3);
  lcd.print(" ");
  delay(500);

  lcd.setCursor(17,3);
  lcd.print(".");
  delay(1000);
  lcd.setCursor(18,3);
  lcd.print(".");
  delay(1500);
  lcd.setCursor(19,3);
  lcd.print(".");
  delay(1000);

  lcd.setCursor(19,3);
  lcd.print(" ");
  delay(1000);
  lcd.setCursor(18,3);
  lcd.print(" ");
  delay(1500);
  lcd.setCursor(17,3);
  lcd.print(" ");
  delay(500);

  lcd.setCursor(17,3);
  lcd.print(".");
  delay(1000);
  lcd.setCursor(18,3);
  lcd.print(".");
  delay(1500);
  lcd.setCursor(19,3);
  lcd.print(".");
  delay(500);
}


void setup() {
  lcd.init();
  lcd.backlight();

  Serial.begin(9600);
  receptorIR.enableIRIn(); //Inicializar o receptor. Para habilitar o Receptor Infravermelho
  
  lcd.createChar(1, emojetriste);
  lcd.createChar(2,corpoBateria);
  lcd.createChar(3,bateriaNivel1);
  lcd.createChar(4,bateriaNivel2);
  lcd.createChar(5,bateriaNivel3);
  lcd.createChar(6,bateriaNivel4);
  
  pinMode(motor,OUTPUT);
  pinMode(buzzer,OUTPUT);
  pinMode(ledReservaVazio,OUTPUT);
  pinMode(btnBuzzer,INPUT_PULLUP);
  pinMode(btnManutencao,INPUT_PULLUP);
  pinMode(tanqueReservaVazio,INPUT);
  pinMode(tanqueReservaCheio,INPUT);

  digitalWrite(motor,HIGH);
  tempoMedicao=millis();
  
  lcd.setCursor(5,0);
  lcd.print("Sistema de");

  lcd.setCursor(2,1);
  lcd.print("Monitoramento de");

  lcd.setCursor(0,2);
  lcd.print("Reservatorio de Agua");

  carregando();
  lcd.clear();
}

void loop() {
  if(millis() >= tempoMedicao){
    tempoMedicao+=intervaloMedicao;
    distanciaUltrassonicoAgua = ultrassonico.read();
    manutencao();
    controloRemote();
  }
}

void resultadoMedicao(){
    altura = alturaTanque - distanciaUltrassonicoAgua;
    volume = altura * larguraTanque * comprimentoTanque;
    litros = volume / 1000;
}

void estadoTanque(){
  /*
   * Referente a configuração dos sensores do tanque reserva(secundário).
   * 
   ************************ Com Água LOW ******************************
   ************************ Sem Água HIGH *****************************
   * 
*/
  //Tanque Principal
      
  if (litros<=1){
    delay(50);
    solicitarAgua = true;
  }
  
  if((solicitarAgua==true) && (digitalRead(tanqueReservaVazio==LOW))){ 
    //se tanque principal tiver apenas 1 litro E se o tanque resevar tiver água, então transporta água
    
    digitalWrite(motor,LOW);  //liga electrobomba
    delay(50);
    
    lcd.home();
    lcd.print("**Tanque Principal**");
    lcd.setCursor(0,1);
    lcd.print("Enchendo ");
    lcd.print(litros);
    lcd.print(" l");
    
    lcd.setCursor(16,1);
    lcd.write(2);
    delay(500);
    
    lcd.setCursor(16,1);
    lcd.write(3);
    delay(500);
    
    lcd.setCursor(16,1);
    lcd.write(4);
    delay(500);

    lcd.setCursor(16,1);
    lcd.write(5);
    delay(500);

    lcd.setCursor(16,1);
    lcd.write(6);
    delay(500);    
  }
  else if (mostrarLitragem==true){

    digitalWrite(motor,HIGH);    //desliga electrobomba
    solicitarAgua=false;

    lcd.home();
    lcd.print("**Tanque Principal**");
    lcd.setCursor(0,1);
    lcd.print("Litros:  ");
    lcd.print(litros);
    lcd.print(" l     ");
    delay(500);
  }

  if(litros>=4.2){
      // tanque principal Cheio

      mostrarLitragem=false;
      solicitarAgua=false;
      digitalWrite(motor,HIGH);    //desliga electrobomba
      delay(50);
      
      lcd.home();
      lcd.print("**Tanque Principal**");
      lcd.setCursor(0,1);
      lcd.print("Litros: ");
      lcd.print(litros);
      lcd.print(" l ");
      lcd.print("Cheio");
      delay(500);
      
  }else mostrarLitragem=true;

//Tanque Reserva(secundario)
  if((digitalRead(tanqueReservaVazio) == HIGH) && (falhaSensor1 == LOW)){
    //tanque reserva VAZIO

    digitalWrite(motor,HIGH);                 //desliga electrobomba
    digitalWrite(ledReservaVazio, HIGH);

    
    lcd.setCursor(0,2);
    lcd.print("***Tanque Reserva***");
    lcd.setCursor(0,3);
    lcd.print("       Vazio!      ");
    delay(500);

    if(estado==true){
        //ligando buzzer
        alarme();
        if(!digitalRead(btnBuzzer)){
          delay(50);
          estado=false;
        }
      }
  }

  else if((tanqueReservaFullest== false) && (falhaSensor1 == false)){

    digitalWrite(ledReservaVazio, LOW);
    
    lcd.setCursor(0,2);
    lcd.print("***Tanque Reserva***");
    lcd.setCursor(0,3);
    lcd.print("      Com Agua!    ");
    digitalWrite(buzzer,LOW);
    delay(500);
  }

  if((digitalRead(tanqueReservaVazio) == LOW) && (digitalRead(tanqueReservaCheio) == LOW)){

    tanqueReservaFullest = true;
    estado=true;
    
    lcd.setCursor(0,2);
    lcd.print("***Tanque Reserva***");
    lcd.setCursor(0,3);
    lcd.print("       Cheio!      ");
    digitalWrite(buzzer,LOW);
    delay(500);
  }else tanqueReservaFullest = false;
  
  if((digitalRead(tanqueReservaVazio)==HIGH) && (digitalRead(tanqueReservaCheio)==LOW)){    
    //Falha no sensor 1

    falhaSensor1 = true; //Com falha no sensor 1
    digitalWrite(ledReservaVazio, LOW);

    digitalWrite(buzzer,LOW);
    lcd.setCursor(0,3);
    lcd.print("Falha no sensor 1 ");
    lcd.write(1);
    delay(500);
  }else falhaSensor1 = false; //sem falha no sensor 1

  
}

void alarme(){
  
  digitalWrite(buzzer,HIGH);
}

void manutencao(){
  if(!digitalRead(btnManutencao)){
    delay(330);
    count++;
  }

  switch(count){
    case 0: delay(100);
            estadoTanque();
            break;
    case 1: delay(100);
            lcd.clear();
            lcd.setCursor(3,1);
            lcd.print("Modo Manutencao");
            lcd.setCursor(7,2);
            lcd.print("Activo");

            //alarme
            digitalWrite(buzzer,HIGH);
            delay(150);
            digitalWrite(buzzer,LOW);
            delay(150);
            digitalWrite(buzzer,HIGH);
            delay(150);
            digitalWrite(buzzer,LOW);
            delay(150);
            break;
    case 2: delay(100);
            count=0;
            break;
  }
}

void controloRemote(){
  if(receptorIR.decode(&resultado)){ //Para verificar se Houve alguma recepção. &Endereço
    Serial.println(resultado.value,HEX);
    delay(500);
    receptorIR.resume(); //Preparar ele para ler um outro comando
  }
}
