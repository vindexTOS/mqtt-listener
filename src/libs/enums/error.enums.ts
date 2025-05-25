export const ERROR_CODES: Record<number, string> = {
    0x01: "Non-specific error",
    0x02: "Memory full",
    0x03: "Bad packet",
    0x11: "Invalid FOTA software version",
    0x12: "Invalid FOTA hardware revision",
    0x13: "Invalid FOTA bin file",
    0x14: "Invalid FOTA bin file size",
    0x15: "FOTA HTTP connection failed",
    0x16: "Invalid FOTA parameters",
    0x17: "Couldn't find FOTA parameters",
    0x18: "FOTA CRC verification failed",
  };