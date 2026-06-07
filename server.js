const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
function createSessionId() {
  return Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();
}

const app = express();
const server = http.createServer(app);

const io = new Server(server);

app.use(express.static("public"));
//app.get("/", (req, res) => {
//  res.sendFile(__dirname + "/public/index.html");
//});

const sessions = {};

function buildState(session) {
  return {
    revealed: session.revealed,
    users: Object.entries(session.users).map(([id, user]) => ({
      id,
      name: user.name,
      role: user.role,
      hasVoted: session.votes[id] !== undefined,
      vote: session.revealed ? session.votes[id] ?? null : null
    }))
  };
}

app.get("/create-session", (req, res) => {
  const id = createSessionId();

  sessions[id] = {
    revealed: false,
    users: {},
    votes: {}
  };

  res.json({
    sessionId: id,
    url: `/session/${id}`
  });
});

app.get("/session/:id", (req, res) => {
  res.sendFile(__dirname + "/public/session.html");
});

io.on("connection", (socket) => {
  let currentSession = null;

  socket.on("join-session", ({ sessionId, name, role }) => {
    const session = sessions[sessionId];

    if (!session) {
      socket.emit("session-missing");
      return;
    }

    currentSession = sessionId;

    session.users[socket.id] = {
      name,
      role
    };

    socket.join(sessionId);

    io.to(sessionId).emit("state-update", buildState(session));
  });

  socket.on("cast-vote", ({ sessionId, vote }) => {
    const session = sessions[sessionId];
    if (!session) return;

    session.votes[socket.id] = vote;

    io.to(sessionId).emit("state-update", buildState(session));
  });

  socket.on("reveal-votes", ({ sessionId }) => {
    const session = sessions[sessionId];
    if (!session) return;

    session.revealed = true;

    io.to(sessionId).emit("state-update", buildState(session));
  });

  socket.on("clear-votes", ({ sessionId }) => {
    const session = sessions[sessionId];
    if (!session) return;

    session.votes = {};
    session.revealed = false;

    io.to(sessionId).emit("state-update", buildState(session));
  });

  socket.on("disconnect", () => {
    if (!currentSession) return;

    const session = sessions[currentSession];

    if (!session) return;

    delete session.users[socket.id];
    delete session.votes[socket.id];

    if (Object.keys(session.users).length === 0) {
      delete sessions[currentSession];
      return;
    }

    io.to(currentSession).emit(
      "state-update",
      buildState(session)
    );
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});