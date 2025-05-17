import { Inject, Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
export interface MqttPayload {
  payload:any,
  topic:string 
}


@Injectable()
export class MqttProvider {

  constructor(
    private readonly eventEmitter: EventEmitter2
  ) { }

  clientConnection = new Map()

  setClientConnection(client: any) {
    this.clientConnection.set(client, client)
  }
   
  TopicHandler(topic, message) {
    const msgJson: any = this.parseHexPayload(message);
  
    if (topic.match(/Locker\/[^\/]+\/events\/general/)) {
      
      if (msgJson.command === 1) {
        // TODO: handle command 1
      }
  
      if (msgJson.command === 3) {
        console.log("COMMAND 3 ")
        const payload = Buffer.from(msgJson.payload, 'binary');
        if (payload.length === 4) {
          msgJson.lockerStatus = payload[0];      // 0 = free, 1 = busy
          msgJson.lockerCharging = payload[1];    // 0 = idle, 1 = charging
          msgJson.lockerDoor = payload[2];        // 0 = closed, 1 = opened
          msgJson.paymentOption = payload[3];     // 0 = idle, 1-4 = payment options
        } else {
          console.warn(`Invalid payload length for command 3: expected 4 bytes, got ${payload.length}`);
        }
      }
  
      if (msgJson.command === 4) {
        const payload = Buffer.from(msgJson.payload);
        const alarmByte = payload[0];
        console.log(msgJson.payload)
        msgJson.alarms = alarmByte
      
        console.log("🚨 Alarm Event:", msgJson.alarms);
      }
  
      this.eventEmitter.emit('generalEventHandler', { payload: msgJson, topic: topic });
  
    } else if (topic.match(/Locker\/[^\/]+\/events\/heartbeat/)) {
      this.eventEmitter.emit('heartBeatHandler', { payload: msgJson, topic: topic });
    }
  }

  generateHexPayload(command, payload = []) {
    const commandBuffer = Buffer.alloc(5); // 4 bytes for timestamp, 1 byte for command
    commandBuffer.writeUInt32LE(Math.floor(Date.now() / 1000), 0); // Write timestamp
    commandBuffer.writeUInt8(command, 4); 

    let payloadBufferList = [];

    for (const key in payload) {
        const item = payload[key];
        switch (item.type) {
            case 'string':
                payloadBufferList.push(Buffer.from(item.value, 'utf8'));
                break;
            case 'timestamp':
                const timeBuffer = Buffer.alloc(4);
                timeBuffer.writeUInt32LE(item.value, 0);
                payloadBufferList.push(timeBuffer);
                break;
            case 'number':

                const numBuffer = Buffer.alloc(1);
                numBuffer.writeUInt8(item.value, 0);
                console.log(numBuffer)
                payloadBufferList.push(numBuffer);
                break;
            case 'number16':
                const num16Buffer = Buffer.alloc(2);
                num16Buffer.writeUInt16LE(item.value, 0);
                payloadBufferList.push(num16Buffer);
                break;
            case 'number32':
                const num32Buf = Buffer.alloc(4);
                num32Buf.writeUInt32LE(item.value, 0);
                payloadBufferList.push(num32Buf);
                break;

        }
    }

    const payloadSize = Buffer.alloc(1);
    const totalPayloadLength = payloadBufferList.reduce((acc, curr) => acc + curr.length, 0);
    payloadSize.writeUInt8(totalPayloadLength, 0);
    payloadBufferList.unshift(payloadSize);

    return Buffer.concat([commandBuffer, ...payloadBufferList]);
}



 
parseHexPayload(byteString) {
  // Assuming 'byteString' is a Node.js Buffer
  const data = {
      timestamp: byteString.readUInt32BE(0),
      command: byteString.readUInt8(4),
      length: byteString.readUInt8(5)
  };

  // Extract payload using the length (starting from byte 6)
  const payload = byteString.slice(6, 6 + data.length);

  return {
      timestamp: data.timestamp,
      command: data.command,
      length: data.length,
      payload: payload
  };
}



}