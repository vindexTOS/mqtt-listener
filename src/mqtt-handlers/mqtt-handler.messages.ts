import { CreateAppConfigDto, CreateAppExt1ConfigDto, OpenDoorDto, ResetLockerPasswordDto } from "src/device/dto/commands.dto"
 
 import fetch from 'node-fetch';

export type messageCommandKeyValueType = {
  type: 'string' | 'number' | 'number16' | "number32" | 'timestamp' | 'buffer' | 'raw',
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
function reverseCrcBytes(crc: number): number {
  return (
    ((crc & 0xFF) << 24) |
    ((crc & 0xFF00) << 8) |
    ((crc & 0xFF0000) >> 8) |
    ((crc & 0xFF000000) >>> 24)
  );
}
export const FotaBeginCommand = async (
  url: string,
  version: string,
  crc32: string,
  fileLength: number
): Promise<messageCommandType> => {
  const [major, minor, patch] = version.split('.');
  const versionStr = `${major.charAt(0)}${minor.charAt(0)}${patch.charAt(0)}`;

   const response = await fetch(url);
  const fileBuffer = Buffer.from(await response.arrayBuffer());

   const fileLengthNew = fileBuffer.length;

   const crc = crc32Custom(fileBuffer, 0xFFFFFFFF);

  return {
    command: 250,
    payload: [
      { type: 'string', value: url },
      { type: 'number', value: 0 },
      { type: 'string', value: versionStr },
      { type: 'number', value: 0 },
      { type: 'timestamp', value: fileLengthNew },
      { type: 'timestamp', value: crc }
    ]
  };
};

 function crc32Custom(buffer: Buffer, initial = 0xFFFFFFFF): number {
  let crc = initial;
  for (let i = 0; i < buffer.length; i++) {
    crc ^= buffer[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xEDB88320 : 0);
    }
  }
  return crc >>> 0;  
}
 
export const SendAppConfigCommand = (params: CreateAppConfigDto): messageCommandType => {
  return {
    command: 240, 
    payload: [
      { type: 'number16', value: 0 },                 
      { type: 'number16', value: params.paymentLimit },           
      { type: 'number16', value: params.fineAmountPerMinute },    
      { type: 'number32', value: params.doorAutoCloseTimeMs },    
      { type: 'number32', value: params.menuTimeoutMs },          

    
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
  const maxSsidLength = 119;  // Maximum length for SSID
  const maxPasswordLength = 124; // Maximum length for Password

  // Calculate how much space is left for ssid and password
  // const payloadLength = 7; // Total number of other fields before ssid and password (adjust if necessary)
  
  // Trim SSID and Password to fit within the remaining space
  const ssid = config.ssid.substring(0, maxSsidLength);
  const password = config.password.substring(0, maxPasswordLength);

  return {
    command: 241,
    payload: [
      { type: 'number16', value: 0},  // Typically 2 bytes
      { type: 'number', value: config.networkType }, // 1 byte
      { type: 'string', value: ssid }, // Ensure SSID fits
      { type: 'number', value: 0 },  // 1 byte
      { type: 'string', value: password }, // Ensure Password fits
      { type: 'number', value: 0 },  // 1 byte
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