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

      }
      if (msgJson.command === 4) {
        const payload = Buffer.from(msgJson.payload, 'binary');
        msgJson.amount = payload.readUInt16BE(0)
        msgJson.card = payload.toString('utf8', 2, 10)


      }
      this.eventEmitter.emit('generalEventHandler', { payload: msgJson, topic: topic });

    } else if (topic.match(/Locker\/[^\/]+\/events\/heartbeat/)) {

      this.eventEmitter.emit('heartBeatHandler', { payload: msgJson, topic: topic });

    }
  }

  generateHexPayload(command, payload = []) {
    const commandBuffer = Buffer.alloc(5); // 4 bytes for timestamp, 1 byte for command
    commandBuffer.writeUInt32LE(Math.floor(Date.now() / 1000), 0); // Write timestamp
    commandBuffer.writeUInt8(command, 4); // Write command

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





  parseHexPayload(byteString: Buffer) {
 
  
     if (byteString.length === 2) {
      return {
        isHeartbeat: true,
        command: 0xFF,  
        networkType: byteString.readUInt8(0),
        signalStrength: byteString.readUInt8(1),
        payload: byteString
      };
    }
  
    //  if (byteString.length < 6) {
    //   throw new Error('Invalid payload length: expected at least 6 bytes');
    // }
  
    const data = {
      timestamp: byteString.readUInt32BE(0),
      command: byteString.readUInt8(4),
      length: byteString.readUInt8(5)
    };
  
    const payload = byteString.slice(6, 6 + data.length);
  
    return {
      timestamp: data.timestamp,
      command: data.command,
      length: data.length,
      payload: payload
    };
  }



}