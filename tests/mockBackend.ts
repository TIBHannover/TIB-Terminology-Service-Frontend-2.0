import http from "http";
import { URL } from "url";

const host = "127.0.0.1";
const port = 3001;

function sendJson(
  res: http.ServerResponse,
  statusCode: number,
  payload: Record<string, unknown>,
) {
  res.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Content-Type, X-TS-Frontend-Id, X-TS-Frontend-Token, X-TS-Auth-Provider, X-TS-Auth-APP-Code, X-CSRF-Token, X-Auth-Token",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify(payload));
}

function collectBody(req: http.IncomingMessage): Promise<Record<string, any>> {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function mockUser() {
  return {
    id: "mock-user-1",
    name: "Mock User",
    token: "mock-provider-token",
    ts_username: "mock_user",
    system_admin: true,
    company: "TIB",
    github_home: "https://github.com/mock-user",
    csrf_token: "mock-csrf-token",
    jwt: "mock-jwt-token",
    settings: {
      userCollectionEnabled: false,
      activeCollection: { title: "", ontology_ids: [] },
      advancedSearchEnabled: false,
      activeSearchSetting: {},
      activeSearchSettingIsModified: false,
    },
  };
}

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    sendJson(res, 404, { _result: { issue: "Not found" } });
    return;
  }

  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  const url = new URL(req.url, `http://localhost:${port}`);

  if (req.method === "GET" && url.pathname === "/user/login/") {
    sendJson(res, 200, { _result: mockUser() });
    return;
  }

  if (req.method === "GET" && url.pathname === "/user/validate_login/") {
    sendJson(res, 200, { _result: { valid: true } });
    return;
  }

  if (req.method === "GET" && url.pathname === "/user/logout/") {
    sendJson(res, 200, { _result: true });
    return;
  }

  if (req.method === "GET" && url.pathname === "/note/list") {
    sendJson(res, 200, {
      _result: {
        notes: [],
        stats: {
          number_of_pinned: 0,
          page: Number(url.searchParams.get("page") ?? 0),
          size: Number(url.searchParams.get("size") ?? 10),
          total_number_of_records: 0,
          totalPageCount: 0,
        },
      },
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/github/issuelist") {
    sendJson(res, 200, { _result: { issues: [] } });
    return;
  }

  if (req.method === "POST" && url.pathname === "/note/create/") {
    const note = await collectBody(req);
    sendJson(res, 200, {
      _result: {
        note_created: {
          ...note,
          id: "mock-note-1",
          created_at: new Date().toISOString(),
          created_by: "mock_user",
          comments: [],
        },
      },
    });
    return;
  }

  sendJson(res, 404, { _result: { issue: "Not found" } });
});

server.listen(port, host, () => {
  console.log(`Mock TS plugin backend listening on http://localhost:${port}`);
});
