export type messageCommandKeyValueType = {
    type: 'string' | 'number' | 'number16' | 'timestamp' | 'buffer',
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

export const CreateDevice = (  hash)=>{
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
          value:hash
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
// referencec data nothing speecial 
  export const StorageResetOptions: { key: string; value: number }[] = [
    { key: "App config reset", value: 1 },         // 0x01
    { key: "Extended1 config reset", value: 2 },   // 0x02
    { key: "Lockers config reset", value: 16 },    // 0x10
    { key: "MQTT config reset", value: 32 },       // 0x20
    { key: "System config reset", value: 64 },     // 0x40
    { key: "Reset all", value: 255 },              // 0xFF
  ];