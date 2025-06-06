import { CreateAppConfigDto, CreateAppExt1ConfigDto, OpenDoorDto, ResetLockerPasswordDto } from "src/device/dto/commands.dto"

export type messageCommandKeyValueType = {
  type: 'string' | 'number' | 'number16' | "number32" | 'timestamp' | 'buffer',
  value: string | number | Buffer
}

export type messageCommandType = {
  command: number
  payload: messageCommandKeyValueType[]
}

export const NoServiceMessage: messageCommandType = {
  command: 6, payload: [
    {
      type: "string",
      value: "servisi"
    },
    {
      type: "number",
      value: 0
    },
    {
      type: "string",
      value: "droebiT"
    },
    {
      type: "number",
      value: 0
    },
    {
      type: "string",
      value: "SezRudulia"
    },
    {
      type: "number",
      value: 0
    },

  ]
}


export const DeviceNotInSystem: messageCommandType = {
  command: 6, payload: [
    {
      type: "string",
      value: "mowyobiloba"
    },
    {
      type: "number",
      value: 0
    },
    {
      type: "string",
      value: "araa"
    },
    {
      type: "number",
      value: 0
    },
    {
      type: "string",
      value: "sistemaSi"
    },
    {
      type: "number",
      value: 0
    },

  ]
}

export const CreateDevice = (hash) => {
  const command: messageCommandType = {
    command: 7,
    payload: [
      {
        type: 'string',
        value: hash
      }
    ]
  };
  return command
}

export const PasswordCommand = (hash: string): messageCommandType => {


  return {
    command: 242,
    payload: [
      {
        type: "number",
        value: 0
      },
      {
        type: "number",
        value: 0
      },
      {
        type: 'string',
        value: hash
      },
      {
        type: "number",
        value: 0
      },
    ]
  };
};


export const StorageResetCommand = (resetSection: number): messageCommandType => {
  return {
    command: 254, // 0xFE
    payload: [
      {
        type: "number",
        value: resetSection
      }
    ]
  };
};

export const StorageResetOptions: { key: string; value: number }[] = [
  { key: "App config reset", value: 1 },
  { key: "Extended1 config reset", value: 2 },
  { key: "Lockers config reset", value: 16 },
  { key: "MQTT config reset", value: 32 },
  { key: "System config reset", value: 64 },
  { key: "Reset all", value: 255 },
];

export const FotaBeginCommand = (url: string, version: string, crc32: Buffer): messageCommandType => {
  const [major, minor, patch] = version.split('.').map(Number);

  return {
    command: 250,
    payload: [
      {
        type: 'string',
        value: url
      },
      {
        type: 'number',
        value: major
      },
      {
        type: 'number',
        value: minor
      },
      {
        type: 'number',
        value: patch
      },
      {
        type: 'buffer',
        value: crc32
      }
    ]
  };
};


export const SendAppConfigCommand = (params: CreateAppConfigDto): messageCommandType => {
  return {
    command: 240, // 0xF0
    payload: [
      { type: 'number16', value: params.startup },                // UINT16
      { type: 'number16', value: params.paymentLimit },           // UINT16
      { type: 'number16', value: params.fineAmountPerMinute },    // UINT16
      { type: 'number32', value: params.doorAutoCloseTimeMs },    // UINT32
      { type: 'number32', value: params.menuTimeoutMs },          // UINT32

      // Services (each: time=UINT32, amount=UINT32)
      { type: 'number32', value: params.services[0].time },
      { type: 'number32', value: params.services[0].amount },
      { type: 'number32', value: params.services[1].time },
      { type: 'number32', value: params.services[1].amount },
      { type: 'number32', value: params.services[2].time },
      { type: 'number32', value: params.services[2].amount },
      { type: 'number32', value: params.services[3].time },
      { type: 'number32', value: params.services[3].amount },

      { type: 'number32', value: params.overTimeAmountPerMinute } // UINT16
    ]
  };
};
export const SendAppExt1ConfigCommand = (config: CreateAppExt1ConfigDto): messageCommandType => {
  return {
    command: 241,
    payload: [
      { type: 'number16', value: config.startup },
      { type: 'number', value: config.networkType },
      { type: 'string', value: config.ssid },
          { type: 'number', value: 0},
      { type: 'string', value: config.password },
            { type: 'number', value: 0},
      // { type: 'number', value: config.uiMode },
      // { type: 'number', value: config.retryCount },
      // { type: 'number', value: config.ledBrightness },
      // { type: 'number16', value: config.inactivityReset },

    ]
  };



};


export const SendResetLockerPasswordCommand = (
  payload: ResetLockerPasswordDto
): messageCommandType => {

  const { lockerId, code } = payload;

  const result: messageCommandType = {
    command: 1,
    payload: [
      { type: 'number' as const, value: lockerId },
      { type: 'string' as const, value: code },
    ]
  };

  return result;
};

export const OpenCloseCommand = (payload: OpenDoorDto): messageCommandType => {
  return {
    command: 2,
    payload: [
      { type: 'number', value: payload.lockerId },
      { type: 'number', value: payload.openClose }
    ]
  };


}

export const SendTransactionReconciliationCommand = () => {
  return {
    command: 3,
    payload: []
  };
};