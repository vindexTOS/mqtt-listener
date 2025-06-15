import { Injectable } from '@nestjs/common';
import {
  CreateDevice,
  DeviceNotInSystem,
  FotaBeginCommand,
  messageCommandKeyValueType,
  NoServiceMessage,
  OpenCloseCommand,
  PasswordCommand,
  SendAppConfigCommand,
  SendAppExt1ConfigCommand,
  SendResetLockerPasswordCommand,
  SendTransactionReconciliationCommand,
  StorageResetCommand,
} from './mqtt-handler.messages';
import { Device } from 'src/device/entities/device.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MqttHandlersProviders {
  // publish message
  constructor(private readonly eventEmitter: EventEmitter2) {}
  async handlePublishMessage(
    typeName: string,
    dev_id: string,
    passedPayload?: any,
  ) {
    switch (typeName) {
      case 'ResetStorage': {
        const commandPayload = StorageResetCommand(passedPayload);
        const payload = this.generatePayload(
          commandPayload.command,
          commandPayload.payload,
        );
        return this.publishMessage(dev_id, payload);
      }
      case 'UpdateFirmware': {
        const { url, version, crc32, fileLength } = passedPayload;

        const commandPayload = await FotaBeginCommand(
          url,
          version,
          crc32,
          fileLength,
        ); // ← await it!

        const payload = this.generatePayload(
          commandPayload.command,
          commandPayload.payload,
        );

        return this.publishMessage(dev_id, payload);
      }
      case 'SendAppConfig': {
        const commandPayload = SendAppConfigCommand(passedPayload);
        const payload = this.generatePayload(
          commandPayload.command,
          commandPayload.payload,
        );
        return this.publishMessage(dev_id, payload);
      }
      case 'SendAppExt1Config': {
        const commandPayload = SendAppExt1ConfigCommand(passedPayload);
        const payload = this.generatePayload(
          commandPayload.command,
          commandPayload.payload,
        );
        return this.publishMessage(dev_id, payload);
      }
      case 'ResetLockerPassword': {
        const commandPayload = SendResetLockerPasswordCommand(passedPayload);
        const payload = this.generatePayload(
          commandPayload.command,
          commandPayload.payload,
        );
        return this.publishMessage(dev_id, payload);
      }
      case 'OpenClose': {
        const commandPayload = OpenCloseCommand(passedPayload);
        const payload = this.generatePayload(
          commandPayload.command,
          commandPayload.payload,
        );
        return this.publishMessage(dev_id, payload);
      }
      case 'Reconciliation': {
        const commandPayload = SendTransactionReconciliationCommand();
        const payload = this.generatePayload(
          commandPayload.command,
          commandPayload.payload,
        );
        return this.publishMessage(dev_id, payload);
      }
    }
  }

  generatePayload(command: number, payload: messageCommandKeyValueType[]) {
    // console.log('generate hexpayload', command);
    return {
      command: command,
      payload: payload,
    };
  }

  async publishMessage(device_id, payload) {
    const data = {
      device_id: device_id,
      payload: payload,
    };
    console.log(payload);
    this.eventEmitter.emit('publishMessage', { data });

    return { msg: `Command has been sent` };
  }

 
}
