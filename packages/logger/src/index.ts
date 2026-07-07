import { AsyncLocalStorage } from "node:async_hooks"
import winston from "winston"

export interface RequestContext {
  correlationId: string
}

export const requestContext = new AsyncLocalStorage<RequestContext>()

export function runWithRequestContext<T>(context: RequestContext, callback: () => T): T {
  return requestContext.run(context, callback)
}

export function getRequestContext() {
  return requestContext.getStore()
}

export function getCorrelationId() {
  return getRequestContext()?.correlationId
}

const correlationFormat = winston.format((info) => {
  const correlationId = getCorrelationId()
  if (correlationId) {
    info.correlationId = correlationId
  }
  return info
})

const devFormat = winston.format.combine(
  correlationFormat(),
  winston.format.colorize({ all: true }),
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.printf((info) => {
    const { timestamp, level, message, correlationId, ...meta } = info
    const corrIdStr = correlationId ? ` [${correlationId}]` : ""
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta, null, 2)}` : ""
    return `${timestamp} [${level}]${corrIdStr}: ${message}${metaStr}`
  })
)

const prodFormat = winston.format.combine(
  correlationFormat(),
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

const isNextJS = process.env.NEXT_RUNTIME !== undefined
const disableFileLogging = process.env.DISABLE_FILE_LOGGING === "true"

const transports: winston.transport[] = [
  new winston.transports.Console({
    stderrLevels: ["error"],
    handleExceptions: true,
  }),
]

if (!isNextJS && !disableFileLogging) {
  transports.push(
    new winston.transports.File({
      filename: "logs/app.log",
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    })
  )
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: process.env.NODE_ENV !== "production" ? devFormat : prodFormat,
  transports,
  exceptionHandlers: (!isNextJS && !disableFileLogging) ? [
    new winston.transports.File({
      filename: "logs/exceptions.log",
    }),
  ] : undefined,
  rejectionHandlers: (!isNextJS && !disableFileLogging) ? [
    new winston.transports.File({
      filename: "logs/rejections.log",
    }),
  ] : undefined,
  exitOnError: false,
})
