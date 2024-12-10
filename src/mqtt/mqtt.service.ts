import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private client: any;

  onModuleInit() {
 
    this.client = mqtt.connect('mqtt://127.0.0.1:1883', {
      clientId: 'nestjs-client',
    });

 
    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');

   
    //   aq shemidlzia meore topicis kawerac subze 
      this.client.subscribe(['test/topic'], (err) => {
        if (err) {
          console.error('Subscription error:', err);
        } else {
          console.log('Successfully subscribed to topics');
        }
      });
    });

 
    this.client.on('error', (error) => {
      console.error('MQTT client error:', error);
    });

 
    this.client.on('message', (topic, message) => {
      console.log(`Received message on topic "${topic}": ${message.toString()}`);
 
    });

    
    this.client.on('close', () => {
      console.error('MQTT connection closed');
    });
  }

  onModuleDestroy() {
     if (this.client) {
      this.client.end();
    }
  }
}
