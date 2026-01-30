// Centrale API configuratie

export const API_CONFIG = {
  // Header naam voor authenticatie
  AUTH_HEADER_NAME: "Authentication" as const,

  // Backend basis URL
  BACKEND_BASE_URL: process.env.BACKEND_BASE_URL || "https://audiomonbackend.slicegames.nl",
} as const;
