import { Injectable } from "@nestjs/common";

@Injectable()
export class MqttProvider {


    TopicHandler(topic,message){
        const msgJson:any = this.parseHexPayload(message);

        if (topic.match(/Lift\/[^\/]+\/events\/general/)) {
            if(msgJson.command === 1) {
    
            }
            if(msgJson.command === 4) {
                const payload = Buffer.from(msgJson.payload, 'binary');
                msgJson.amount = payload.readUInt16BE(0)
                msgJson.card = payload.toString('utf8', 2, 10)
    
            }
            // axios.get('https://3.71.18.216/api/mqtt/general', {
            //     params:{
            //         payload: msgJson,
            //         topic: topic
            //     }
            // })
            //     .then(response => {
            //     })
            //     .catch(error => console.error('Error sending general event', error));
        } else if (topic.match(/Lift\/[^\/]+\/events\/heartbeat/)) {
            // axios.get('https://3.71.18.216/api/mqtt/heartbeat', {
            //     params:{
            //         payload: msgJson,
            //         topic: topic
            //     }
            // })
            //     .then(response => {})
            //     .catch(error => console.error('Error sending heartbeat event', error));
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
    
          }
        }
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