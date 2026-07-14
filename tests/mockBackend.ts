import http from "http";
import { URL } from "url";

const host = "127.0.0.1";
const port = 3001;
const mockUserId = "mock-user-1";
const mockUsername = "mock_user";
let nextNoteId = 2;
let nextCommentId = 2;

type MockNote = Record<string, any> & {
  id: string;
  comments: Record<string, any>[];
};

const editorContent = (text: string) =>
  JSON.stringify({
    blocks: [
      {
        key: "mock",
        text,
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
    ],
    entityMap: {},
  });

function initialNotes(): MockNote[] {
  return [{
    id: "1",
    title: "Mock CHMO note",
    semantic_component_iri: "http://purl.obolibrary.org/obo/OBI_0000070",
    semantic_component_label: "assay",
    semantic_component_type: "class",
    content: editorContent("Existing note content"),
    ontology_id: "chmo",
    visibility: "public",
    created_at: "2025-01-01T10:00:00.000Z",
    created_by: {
      id: mockUserId,
      name: "Mock User",
      username: mockUsername,
    },
    pinned: false,
    is_reported: false,
    can_edit: true,
    imported: false,
    comments_count: 1,
    comments: [
      {
        id: "1",
        content: editorContent("Existing comment"),
        created_at: "2025-01-01T11:00:00.000Z",
        created_by: mockUsername,
        is_reported: false,
        can_edit: true,
      },
    ],
  }];
}

let notes: MockNote[] = initialNotes();

function resetData() {
  notes = initialNotes();
  nextNoteId = 2;
  nextCommentId = 2;
}

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
    id: mockUserId,
    name: "Mock User",
    token: "mock-provider-token",
    ts_username: mockUsername,
    system_admin: false,
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

function noteListStats(filteredNotes: MockNote[], url: URL) {
  const page = Number(url.searchParams.get("page") ?? 1);
  const size = Number(url.searchParams.get("size") ?? 10);
  return {
    number_of_pinned: filteredNotes.filter((note) => note.pinned).length,
    page,
    size,
    total_number_of_records: filteredNotes.length,
    totalPageCount: filteredNotes.length ? Math.ceil(filteredNotes.length / size) : 0,
  };
}

function normalizeNote(note: MockNote) {
  return {
    ...note,
    comments_count: note.comments.length,
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

  if (req.method === "POST" && url.pathname === "/__reset") {
    resetData();
    sendJson(res, 200, { _result: { reset: true } });
    return;
  }

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

  if (req.method === "GET" && url.pathname === "/term_set/get/") {
    sendJson(res, 200, { _result: { term_sets: [] } });
    return;
  }

  if (req.method === "POST" && url.pathname === "/admin/is_entity_admin/") {
    sendJson(res, 200, { _result: { is_admin: false } });
    return;
  }

  if (req.method === "GET" && url.pathname === "/note/list") {
    const ontology = url.searchParams.get("ontology");
    const type = url.searchParams.get("artifact_type");
    const filteredNotes = notes.filter(
      (note) =>
        (!ontology || note.ontology_id === ontology) &&
        (!type || note.semantic_component_type === type),
    );
    sendJson(res, 200, {
      _result: {
        notes: filteredNotes.map(normalizeNote),
        stats: noteListStats(filteredNotes, url),
      },
    });
    return;
  }

  if (req.method === "GET" && url.pathname.startsWith("/note/get/")) {
    const noteId = url.pathname.split("/")[3];
    const note = notes.find((note) => note.id === noteId);
    if (!note) {
      sendJson(res, 404, { _result: { issue: "Not found" } });
      return;
    }
    sendJson(res, 200, {
      _result: {
        note: normalizeNote(note),
        number_of_pinned: notes.filter((note) => note.pinned).length,
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
    const newNote: MockNote = {
      ...note,
      id: String(nextNoteId++),
      created_at: new Date().toISOString(),
      created_by: {
        id: mockUserId,
        name: "Mock User",
        username: mockUsername,
      },
      comments: [],
      comments_count: 0,
      pinned: false,
      is_reported: false,
      can_edit: true,
      imported: false,
    };
    notes.unshift(newNote);
    sendJson(res, 200, {
      _result: {
        note_created: newNote,
      },
    });
    return;
  }

  if (req.method === "PUT" && url.pathname === "/note/update/") {
    const updatedNote = await collectBody(req);
    const note = notes.find((note) => note.id === String(updatedNote.noteId));
    if (!note) {
      sendJson(res, 404, { _result: { issue: "Not found" } });
      return;
    }
    Object.assign(note, updatedNote);
    sendJson(res, 200, { _result: { note_updated: normalizeNote(note) } });
    return;
  }

  if (req.method === "DELETE" && url.pathname === "/note/delete/") {
    const payload = await collectBody(req);
    const noteIndex = notes.findIndex((note) => note.id === String(payload.objectId));
    if (payload.objectType === "note" && noteIndex >= 0) {
      notes.splice(noteIndex, 1);
      sendJson(res, 200, { _result: { deleted: true } });
      return;
    }

    for (const note of notes) {
      const commentIndex = note.comments.findIndex(
        (comment) => comment.id === String(payload.objectId),
      );
      if (payload.objectType === "comment" && commentIndex >= 0) {
        note.comments.splice(commentIndex, 1);
        sendJson(res, 200, { _result: { deleted: true } });
        return;
      }
    }
    sendJson(res, 404, { _result: { issue: "Not found" } });
    return;
  }

  if (req.method === "POST" && url.pathname === "/note/create_comment/") {
    const payload = await collectBody(req);
    const note = notes.find((note) => note.id === String(payload.noteId));
    if (!note) {
      sendJson(res, 404, { _result: { issue: "Not found" } });
      return;
    }
    const comment = {
      id: String(nextCommentId++),
      content: payload.content,
      created_at: new Date().toISOString(),
      created_by: mockUsername,
      is_reported: false,
      can_edit: true,
    };
    note.comments.push(comment);
    sendJson(res, 200, { _result: { comment_created: comment } });
    return;
  }

  if (req.method === "POST" && url.pathname === "/report/create/") {
    sendJson(res, 200, { _result: { report_created: true } });
    return;
  }

  sendJson(res, 404, { _result: { issue: "Not found" } });
});

server.listen(port, host, () => {
  console.log(`Mock TS plugin backend listening on http://localhost:${port}`);
});
