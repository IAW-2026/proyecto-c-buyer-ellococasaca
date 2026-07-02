import { NextRequest } from "next/server";

/**
 * Valida si la petición incluye la clave secreta interna correcta en la cabecera 'x-inter-service-secret'.
 */
export function isValidInternalRequest(req: NextRequest): boolean {
  const secret = process.env.INTER_SERVICE_SECRET;
  if (!secret) {
    console.error("Missing INTER_SERVICE_SECRET environment variable.");
    return false;
  }
  const secretHeader = req.headers.get("x-inter-service-secret");

  return !!secretHeader && secretHeader === secret;
}
