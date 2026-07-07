import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { db } from "@workspace/db";

const port = Number.parseInt(process.env.PORT ?? "4000", 10);

// Helper function to read the body of a request
const getRequestBody = (req: IncomingMessage): Promise<string> => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      resolve(body);
    });
    req.on("error", (err) => {
      reject(err);
    });
  });
};

// Helper function to send CORS headers
const setCorsHeaders = (res: ServerResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

const server = createServer(async (req, res) => {
  setCorsHeaders(res);

  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const { url, method } = req;

  try {
    // Health check endpoint
    if (url === "/" || url === "/api") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, service: "api" }));
      return;
    }

    // GET /api/users - Fetch all users
    if (url === "/api/users" && method === "GET") {
      const users = await db.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(users));
      return;
    }

    // POST /api/users - Create a new user
    if (url === "/api/users" && method === "POST") {
      const bodyText = await getRequestBody(req);
      const { email, name } = JSON.parse(bodyText);

      if (!email) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Email is required." }));
        return;
      }

      const user = await db.user.create({
        data: {
          email,
          name,
        },
      });

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(user));
      return;
    }

    // 404 Route Not Found
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  } catch (error: any) {
    console.error("API Error:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Internal Server Error",
        message: error.message || String(error),
      })
    );
  }
});

server.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
