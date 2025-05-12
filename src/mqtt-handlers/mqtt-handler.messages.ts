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