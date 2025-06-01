// import {
//   WebSocketGateway,
//   WebSocketServer,
//   SubscribeMessage,
//   MessageBody,
//   OnGatewayInit,
// } from '@nestjs/websockets';
// import { Server } from 'socket.io';
// import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
// import { Logger } from '@nestjs/common';
// import { DeviceService } from './device/device.service';

// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
// })
// @WebSocketGateway({ cors: { origin: '*' } })
// export class SocketGateway implements OnGatewayInit {
//   constructor(
//     private readonly eventEmitter: EventEmitter2,
//     private readonly deviceService: DeviceService,
//   ) {}

//   @WebSocketServer()
//   server: Server;

//   afterInit(server: Server) {
//     console.log('WebSocket Gateway Initialized');
//   }

//   @SubscribeMessage('getDevices')
//   async handleDeviceList(@MessageBody() query: any) {
//     return await this.deviceService.findAll(query);
//   }

//   @SubscribeMessage('getDevice')
//   async handleSingleDevice(@MessageBody() id: number) {
//     return await this.deviceService.findOne(id);
//   }

//   @OnEvent('onDeviceUpdate', { async: true })
//   async handleDeviceUpdate() {
//     const devices = await this.deviceService.findAll({});
//     this.server.emit('chargePoints', devices);
//   }
// }
