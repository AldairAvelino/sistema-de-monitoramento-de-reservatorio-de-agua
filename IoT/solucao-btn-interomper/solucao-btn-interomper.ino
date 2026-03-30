#define nivelA 2
#define nivelB 3

#define btnInteromper 5
int estadoBtnInteromper;

int estadoA;
int estadoB;
int counter=0;
void setup() {
  // put your setup code here, to run once:
  pinMode(nivelA, INPUT);
  pinMode(nivelB, INPUT);
  pinMode(btnInteromper, INPUT);
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  estadoA=digitalRead(nivelA);
  estadoB=digitalRead(nivelB);

  estadoBtnInteromper=digitalRead(btnInteromper);
  if(estadoBtnInteromper==HIGH){
    counter=counter+1;
    delay(100);
  }

  switch(counter){
    case 0: //Serial.println("Wash TANQUE MODE OFF");      
      if(estadoB==LOW && estadoA==HIGH){
        Serial.println("Falha nos sensores");
        delay(330);
      }
  
      if(estadoB==HIGH && estadoA==HIGH){
        Serial.println("Precisa encher o tanque reserva");
        delay(330);
      }
    
      if((estadoB==HIGH && estadoA==LOW) || (estadoB==LOW && estadoA==LOW)){
        Serial.println("Enviando agua no outro TANQUE ***");
        delay(330);
      }
      delay(330);
      break;

    case 1: Serial.println("Wash TANQUE MODE ON");
      delay(330);
      break;

    case 2: delay(330);
      counter=0;
      break;
  }
  
  
}
