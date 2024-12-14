export type messageCommandKeyValueType = {
    type: string
    value: string | number
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