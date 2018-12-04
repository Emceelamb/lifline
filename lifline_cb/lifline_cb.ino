      int rag=0;
int rad = 0;
int togswitch = 2;
int switchState=0;

void setup() {

  Serial.begin(9600);
  pinMode(togswitch, INPUT);
  
}

void loop() {

  switchState = digitalRead(togswitch);
  
  rad = analogRead(A0);
  rag = analogRead(A1);
  int valToSend = rad;
  Serial.print(valToSend);
  Serial.print(",\t");
  valToSend=rag;
  Serial.print(valToSend);
  Serial.print(",\t");
  valToSend=switchState;
  Serial.println(valToSend);
  delay(10);
 
//  Serial.print("radius: "+str(rad)+" rag: "+str(rag)+" button: "+switchState);
    
}
