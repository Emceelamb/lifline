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
