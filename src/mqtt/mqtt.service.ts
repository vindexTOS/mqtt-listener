import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { MqttProvider } from './mqtt.provider';
import { OnEvent } from '@nestjs/event-emitter';
 
import { messageCommandType } from 'src/mqtt-handlers/mqtt-handler.messages';
type handlePublishMessageType = {
  data: { device_id: string, payload: messageCommandType }
}
@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly mqttProvider: MqttProvider) { }

  @OnEvent("publishMessage")
  async handleGeneralPublishMessage(dataPayload: handlePublishMessageType) {

    const { data } = dataPayload
    const { device_id, payload } = data
    this.publishMessage(device_id, this.mqttProvider.generateHexPayload(payload.command, payload.payload))

  }

  private client: any;
  generalTopic = 'Locker/+/events/general';
  heartbeatTopic = 'Locker/+/events/heartbeat';


  onModuleInit() {



    this.client = mqtt.connect('mqtt://localhost', {
      port: 1883
    });
    // this.client = mqtt.connect('mqtt://116.203.146.251', {
    //   port: 1883,
    //   username: 'smartLockUser',       
    //   password: 'smartLock.97!G@4',      
    // });

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');


      //   aq shemidlzia meore topicis kawerac subze 
      this.client.subscribe([this.generalTopic, this.heartbeatTopic], (err) => {
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

      this.mqttProvider.TopicHandler(topic, message)



    });


    this.client.on('close', () => {
      console.error('MQTT connection closed');
    });

    this.client.on('packetsend', (packet) => {
      if (packet.cmd === 'publish') {
        console.log('📤 MQTT PUBLISH packet sent:');
        console.log('  → topic:', packet.topic);
        console.log('  → payload (hex):', packet.payload?.toString('hex'));
      }
    });



  }

  onModuleDestroy() {
    if (this.client) {
      this.client.end();
    }
  }

  publishMessage(device_id, payload) {
    const topic = `Locker/${device_id}/commands/general`;
  // console.log('📡 Publishing to MQTT topic:', topic);
  console.log('🧾 Raw Payload Buffer:', payload);
  console.log('🧾 Payload as HEX:', payload.toString('hex'));
  
  // 🔍 LOGGING ENDS HERE

    this.client.publish(topic, payload, { qos: 1 }, (err) => {
      if (err) {
        console.log(err)
      } else {
        console.log(topic)
      }
    });
  }


}
