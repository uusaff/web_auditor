import { URL } from 'url';

function validateTargetUrl(rawUrl: string): { valid: boolean; reason?: string } {
  try {
    const parsed = new URL(rawUrl);

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, reason: 'Only HTTP and HTTPS protocols are supported.' };
    }

    const hostname = parsed.hostname.toLowerCase();

    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname === '0.0.0.0') {
      return { valid: false, reason: 'Access to local resources is strictly prohibited.' };
    }

    const privateIpRegex = /^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.|169\.254\.)/;
    if (privateIpRegex.test(hostname)) {
      return { valid: false, reason: 'Access to internal IP ranges is prohibited.' };
    }

    return { valid: true };
  } catch {
    return { valid: false, reason: 'Malformed URL provided.' };
  }
}

const testCases = [
  { url: 'http://169.254.169.254/latest/meta-data/', expected: false, desc: 'AWS Metadata Endpoint' },
  { url: 'http://localhost:3000', expected: false, desc: 'Localhost Loopback' },
  { url: 'http://127.0.0.1:8080/admin', expected: false, desc: 'Loopback IP' },
  { url: 'http://192.168.1.1/router', expected: false, desc: 'Private LAN Subnet' },
  { url: 'http://10.0.0.1', expected: false, desc: 'Class A Private Subnet' },
  { url: 'file:///etc/passwd', expected: false, desc: 'File Protocol' },
  { url: 'gopher://example.com', expected: false, desc: 'Gopher Protocol' },
  { url: 'https://example.com', expected: true, desc: 'Valid Public Domain' },
  { url: 'http://142.250.190.46', expected: true, desc: 'Valid Public IP (Google)' },
];

console.log('--- RUNNING SSRF BLOCKLIST TESTS ---\n');
let passed = 0;
testCases.forEach(({ url, expected, desc }) => {
  const result = validateTargetUrl(url);
  const isCorrect = result.valid === expected;
  if (isCorrect) passed++;
  console.log(`${isCorrect ? '✅ PASS' : '❌ FAIL'}: [${desc}]`);
  console.log(` URL: ${url}`);
  console.log(` Allowed: ${result.valid}${result.reason ? ` (${result.reason})` : ''}\n`);
});

console.log(`Result: ${passed}/${testCases.length} test cases passed.`);
