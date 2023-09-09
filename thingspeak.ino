#include <SoftwareSerial.h>
#define RX 2 // TX of esp8266 is connected with Arduino pin 2
#define TX 3 // RX of esp8266 is connected with Arduino pin 3

String WIFI_SSID = "Engineers House";     // WIFI NAME
String WIFI_PASS = "takadaw100"; // WIFI PASSWORD
String API = "KDZ8CPU3VWGIMP2J";       // Write API KEY
String HOST = "api.thingspeak.com";
String PORT = "80";

int countTrueCommand;
int countTimeCommand;
boolean found = false;

SoftwareSerial esp8266(RX, TX);

void setup() {
  Serial.begin(9600);
  esp8266.begin(9600);
  sendCommand("AT", 5, "OK");
  sendCommand("AT+CWMODE=1", 5, "OK");
  sendCommand("AT+CWJAP=\"" + WIFI_SSID + "\",\"" + WIFI_PASS + "\"", 20, "OK");
}

void loop() {
  int mq135Value = analogRead(A0); // Read MQ135 sensor
  int mq2Value = analogRead(A1);   // Read MQ2 sensor
  float lm35Voltage = (analogRead(A2) *  (2.2 / 1024.0));  // Convert ADC reading to voltage (5.0V / 1024 steps)
  float temperatureC = (lm35Voltage * 100); // Convert voltage to Celsius

  String getData = "GET /update?api_key=" + API + "&field1=" + mq135Value +
                   "&field2=" + mq2Value + "&field3=" + temperatureC;


  sendCommand("AT+CIPMUX=1", 5, "OK");
  sendCommand("AT+CIPSTART=0,\"TCP\",\"" + HOST + "\"," + PORT, 15, "OK");
  sendCommand("AT+CIPSEND=0," + String(getData.length() + 4), 4, ">");
  esp8266.println(getData);
  delay(1500);
  countTrueCommand++;
  sendCommand("AT+CIPCLOSE=0", 5, "OK");
}

void sendCommand(String command, int maxTime, char readReplay[]) {
  Serial.print(countTrueCommand);
  Serial.print(". at command => ");
  Serial.print(command);
  Serial.print(" ");

  while (countTimeCommand < (maxTime * 1)) {
    esp8266.println(command);
    if (esp8266.find(readReplay)) {
      found = true;
      break;
    }
    countTimeCommand++;
  }

  if (found == true) {
    Serial.println("OK");
    countTrueCommand++;
    countTimeCommand = 0;
  }

  if (found == false) {
    Serial.println("Fail");
    countTrueCommand = 0;
    countTimeCommand = 0;
  }

  found = false;
}
