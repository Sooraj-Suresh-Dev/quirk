const reset = '\x1b[0m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const red = '\x1b[31m';
const gray = '\x1b[90m';
const cyan = '\x1b[36m';
const bold = '\x1b[1m';

function timestamp(): string {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

function colorStatus(status: number): string {
  if (status >= 500) return `${red}${status}${reset}`;
  if (status >= 400) return `${yellow}${status}${reset}`;
  return `${green}${status}${reset}`;
}

export function logRequest(method: string, path: string, status: number, duration: number) {
  const t = timestamp();
  const paddedMethod = method.padEnd(7);
  console.log(`[${t}] ${cyan}${paddedMethod}${reset} ${path}  ${colorStatus(status)}  ${gray}${duration}ms${reset}`);
}

export function logError(message: string, context?: Record<string, unknown>) {
  const t = timestamp();
  if (context && Object.keys(context).length > 0) {
    console.error(`[${t}] ${red}${bold}ERROR${reset} ${message}`, context);
  } else {
    console.error(`[${t}] ${red}${bold}ERROR${reset} ${message}`);
  }
}

export function logWarn(message: string, context?: Record<string, unknown>) {
  const t = timestamp();
  if (context && Object.keys(context).length > 0) {
    console.warn(`[${t}] ${yellow}WARN${reset} ${message}`, context);
  } else {
    console.warn(`[${t}] ${yellow}WARN${reset} ${message}`);
  }
}

export function logInfo(message: string) {
  const t = timestamp();
  console.log(`[${t}] ${message}`);
}
