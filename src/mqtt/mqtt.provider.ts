import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ERROR_CODES } from 'src/libs/enums/error.enums';
export interface MqttPayload {
  payload: any;
  topic: string;
}

@Injectable()
export class MqttProvider {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  clientConnection = new Map();

  setClientConnection(client: any) {
    this.clientConnection.set(client, client);
  }

  TopicHandler(topic, message) {
    const msgJson: any = this.parseHexPayload(message);
    // console.log(msgJson)
    if (topic.match(/Locker\/[^\/]+\/events\/general/)) {
      if (msgJson.command === 1) {
        msgJson.amount = msgJson.payload.readUInt16LE(0);
      }

      if (msgJson.command === 2) {
        msgJson.operationCode = msgJson.payload[0];
        msgJson.operationStatus = msgJson.payload[1];
        msgJson.amount = msgJson.payload.readUInt16LE(2);
      }
      //  TO DO  250 command added
      if (msgJson.command === 3) {
        // 66 1F A9 12 03 05 02 01 01 00 02

        const payload = Buffer.from(msgJson.payload, 'binary');

        //  add  locker id as first 0 byte
        msgJson.lockerId = payload[0]; // 0-999
        msgJson.lockerStatus = payload[1]; // 0 = free, 1 = busy
        msgJson.lockerCharging = payload[2]; // 0 = idle, 1 = charging
        msgJson.lockerDoor = payload[3]; // 0 = closed, 1 = opened
        msgJson.paymentOption = payload[4]; // 0 = idle, 1-4 = payment options
        // console.log(msgJson);
      }

      if (msgJson.command === 4) {
        const payload = Buffer.from(msgJson.payload);
        const alarmByte = payload[0];
        console.log(msgJson.payload);
        msgJson.alarms = alarmByte;

        console.log('🚨 Alarm Event:', msgJson.alarms);
      }

      if (msgJson.command === 254) {
        const errorCode = msgJson.payload[0];

        const errorMessage =
          ERROR_CODES[errorCode] || `Unknown error (code ${errorCode})`;

        msgJson.error_code = errorCode;
        msgJson.error_message = errorMessage;

        console.error(
          `❌ DEVICE ERROR [${topic.split('/')[1]}] → ${errorMessage} (code ${errorCode})`,
        );
      }
      if (msgJson.command === 240) {
        // 01 00 0A 01 00 00 00

        const dev_id = topic.split('/')[1];
        const payload = msgJson.payload;

        const deviceType = payload[0];
        const hardwareVersion = payload.slice(1, 4).toString(); // ASCII, like "00A"
        const swRaw = payload.slice(4, 7);
        const softwareVersion = `${swRaw[0]}.${swRaw[1]}.${swRaw[2]}`;

        msgJson.device_type = deviceType;
        msgJson.hardware_version = hardwareVersion;
        msgJson.software_version = softwareVersion;

        // console.log(`📦 DEVICE SETUP from ${dev_id}`);
        // console.log(`   → Type: ${deviceType}`);
        // console.log(`   → HW Ver: ${hardwareVersion}`);
        // console.log(`   → SW Ver: ${softwareVersion}`);
      }
      this.eventEmitter.emit('generalEventHandler', {
        payload: msgJson,
        topic: topic,
      });
    } else if (topic.match(/Locker\/[^\/]+\/events\/heartbeat/)) {
      console.log({ payload: msgJson, topic: topic });
      this.eventEmitter.emit('heartBeatHandler', {
        payload: msgJson,
        topic: topic,
      });
    }
  }

  generateHexPayload(command, payload = []) {
    const commandBuffer = Buffer.alloc(5);
    commandBuffer.writeUInt32LE(Math.floor(Date.now() / 1000), 0);
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

          payloadBufferList.push(numBuffer);
          break;
        case 'number16':
          const num16Buffer = Buffer.alloc(2);
          num16Buffer.writeUInt16LE(item.value, 0);
          payloadBufferList.push(num16Buffer);
          break;
        case 'number32': {
          const num32Buf = Buffer.alloc(4);

          // Detect command 250 AND the last payload item = CRC
          const isCommand250 = command === 250;
          const isCRCField = isCommand250 && key === String(payload.length - 1);

          if (isCRCField) {
            num32Buf.writeUInt32BE(item.value, 0); // ✅ Only CRC is Big Endian
            console.log('📦 [CRC32] Sent as BE:', num32Buf);
          } else {
            num32Buf.writeUInt32LE(item.value, 0); // ✅ Everything else stays LE
            console.log('📦 [number32] Sent as LE:', num32Buf);
          }

          payloadBufferList.push(num32Buf);
          break;
        }
      }
    }

    const payloadSize = Buffer.alloc(1);
    const totalPayloadLength = payloadBufferList.reduce(
      (acc, curr) => acc + curr.length,
      0,
    );
    payloadSize.writeUInt8(totalPayloadLength, 0);
    payloadBufferList.unshift(payloadSize);

    return Buffer.concat([commandBuffer, ...payloadBufferList]);
  }

  parseHexPayload(byteString: Buffer) {
    // 🟢 Case 1: Heartbeat — exactly 2 bytes
    if (byteString.length === 2) {
      return {
        isHeartbeat: true,
        command: 0xff, // virtual code
        networkType: byteString.readUInt8(0),
        signalStrength: byteString.readUInt8(1),
        payload: byteString,
      };
    }

    // 🟡 Case 2: Structured packet — must be at least 6 bytes
    if (byteString.length >= 6) {
      const timestamp = byteString.readUInt32BE(0);
      const command = byteString.readUInt8(4);
      const length = byteString.readUInt8(5);

      if (byteString.length >= 6 + length) {
        const payload = byteString.slice(6, 6 + length);
        return { timestamp, command, length, payload };
      } else {
        return {
          isMalformed: true,
          reason: 'Invalid declared length',
          raw: byteString,
        };
      }
    }

    // 🔴 Fallback — too short or unknown format
    return {
      isMalformed: true,
      reason: 'Unknown or unsupported packet format',
      raw: byteString,
    };
  }

  // parseHexPayload(byteString) {
  //    const data = {
  //       timestamp: byteString.readUInt32BE(0),
  //       command: byteString.readUInt8(4),
  //       length: byteString.readUInt8(5)
  //   };

  //    const payload = byteString.slice(6, 6 + data.length);

  //   return {
  //       timestamp: data.timestamp,
  //       command: data.command,
  //       length: data.length,
  //       payload: payload
  //   };
  // }
}
