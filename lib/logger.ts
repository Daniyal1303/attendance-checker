type LogLevel = "debug" | "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

const isProduction = process.env.NODE_ENV === "production";

function write(level: LogLevel, message: string, context?: LogContext) {
  const entry = {
    level,
    message,
    time: new Date().toISOString(),
    ...context,
  };

  const line = isProduction ? JSON.stringify(entry) : entry;
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (message: string, context?: LogContext) => write("debug", message, context),
  info: (message: string, context?: LogContext) => write("info", message, context),
  warn: (message: string, context?: LogContext) => write("warn", message, context),
  error: (message: string, context?: LogContext) => write("error", message, context),
};
