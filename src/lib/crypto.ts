import crypto from 'crypto';

const SIGNING_SECRET = process.env.AUDIT_SIGNING_SECRET || process.env.OPENROUTER_API_KEY || 'audit-signing-fallback-key';

interface AuditPayload {
  url: string;
  deep: boolean;
  ts: number;
}

export function signAuditParams(url: string, deep: boolean): string {
  const payload: AuditPayload = { url, deep, ts: Date.now() };
  const payloadJson = JSON.stringify(payload);
  const payloadB64 = Buffer.from(payloadJson).toString('base64url');
  const hmac = crypto.createHmac('sha256', SIGNING_SECRET).update(payloadJson).digest('base64url');
  return `${payloadB64}.${hmac}`;
}

export function verifyAuditParams(token: string): { url: string; deep: boolean; valid: boolean } {
  try {
    const [payloadB64, hmac] = token.split('.');
    if (!payloadB64 || !hmac) return { url: '', deep: false, valid: false };

    const payloadJson = Buffer.from(payloadB64, 'base64url').toString();
    const expectedHmac = crypto.createHmac('sha256', SIGNING_SECRET).update(payloadJson).digest('base64url');

    if (hmac !== expectedHmac) return { url: '', deep: false, valid: false };

    const payload: AuditPayload = JSON.parse(payloadJson);
    if (!payload.url || typeof payload.deep !== 'boolean' || !payload.ts) {
      return { url: '', deep: false, valid: false };
    }

    const ageInHours = (Date.now() - payload.ts) / (1000 * 60 * 60);
    if (ageInHours > 1) return { url: payload.url, deep: false, valid: false };

    return { url: payload.url, deep: payload.deep, valid: true };
  } catch {
    return { url: '', deep: false, valid: false };
  }
}
