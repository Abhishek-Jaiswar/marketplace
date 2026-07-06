import { createServer } from "node:http"

const port = Number.parseInt(process.env.PORT ?? "4000", 10)

const server = createServer((_req, res) => {
  res.writeHead(200, { "content-type": "application/json" })
  res.end(JSON.stringify({ ok: true, service: "api" }))
})

server.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`)
})
