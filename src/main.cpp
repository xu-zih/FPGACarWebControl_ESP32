#include <Arduino.h>
#include <SPIFFS.h>
#include <WiFi.h>

#include "ESPAsyncWebServer.h"

// Pin definitions
const int ROTATE = 35;
const int DIRECTION1 = 36;
const int DIRECTION0 = 37;
const int SPEED1 = 38;
const int SPEED0 = 39;

// Wifi information
const char* WIFI_UUID = "CS110";
const char* WIFI_PASSWORD = "asc2023.";

// Web server
AsyncWebServer server(80);

void setup() {
  // Pin init
  pinMode(ROTATE, OUTPUT);
  pinMode(DIRECTION1, OUTPUT);
  pinMode(DIRECTION0, OUTPUT);
  pinMode(SPEED1, OUTPUT);
  pinMode(SPEED0, OUTPUT);

  // Serial init
  Serial.begin(115200);
  Serial.println("Serial is ready");

  // Wifi init
  WiFi.begin(WIFI_UUID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi.");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("Connected to WiFi");
  Serial.println("IP Address: ");
  Serial.println(WiFi.localIP());

  // SPIFFS init
  if (!SPIFFS.begin()) {
    Serial.println("An Error has occurred while mounting SPIFFS");
    return;
  }
  Serial.println("SPIFFS is ready");

  // Web server init
  // Client side
  server.serveStatic("/", SPIFFS, "/www/").setDefaultFile("index.html");
  // Server side
  server.on("/status", HTTP_GET, [](AsyncWebServerRequest* request) {
    if (request->hasParam("value")) {
      AsyncWebParameter* p = request->getParam("value");
      // value格式“正反向（1/0）左右向（01右/10左）速度（2位二进制）”
      uint8_t rotate = p->value().charAt(0) - '0';
      uint8_t direction1 = p->value().charAt(1) - '0';
      uint8_t direction0 = p->value().charAt(2) - '0';
      uint8_t speed1 = p->value().charAt(3) - '0';
      uint8_t speed0 = p->value().charAt(4) - '0';
      digitalWrite(ROTATE, rotate);
      digitalWrite(DIRECTION1, direction1);
      digitalWrite(DIRECTION0, direction0);
      digitalWrite(SPEED1, speed1);
      digitalWrite(SPEED0, speed0);
    }
    // 返回当前状态
    String status = String(digitalRead(ROTATE)) +
                    String(digitalRead(DIRECTION1)) +
                    String(digitalRead(DIRECTION0)) +
                    String(digitalRead(SPEED1)) +
                    String(digitalRead(SPEED0));
    request->send(200, "text/plain", status);
  });
  server.begin();
  Serial.println("Web server is ready");
}

void loop() {}
