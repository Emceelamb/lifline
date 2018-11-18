// // Arduino pin numbers
// const int SW_pin = 2; // digital pin connected to switch output
// const int X_pin = 0; // analog pin connected to X output
// const int Y_pin = 1; // analog pin connected to Y output

// int xPos=0;
// int yPos=0;

// void setup() {
//     pinMode(SW_pin, INPUT);
//     digitalWrite(SW_pin, HIGH);
//     Serial.begin(9600);
// }

// int joystick = [2];

// void loop() {
//     xPos=analogRead(X_pin);
//     // yPos=analogRead(Y_pin);
//     // Serial.print("Switch:  ");
//     // Serial.print(digitalRead(SW_pin));
//     // Serial.print("\n");
//     // Serial.print("X-axis: ");
//     // Serial.print(xPos);
//     // Serial.print("\n");
//     // Serial.print("Y-axis: ");
//     // Serial.println(yPos);
//     // Serial.print("\n\n");

//     joystick = [xPos,yPos];
//     Serial.write(yPos);    
//     delay(1);
// }


void setup() {
  Serial.begin(9600);
}
void loop() {
  int valueToSend = analogRead(A0)/4;
  Serial.print(valueToSend);
  Serial.print(",");
  valueToSend = analogRead(A1)/4;
  Serial.println(valueToSend);
  delay (10);
}
