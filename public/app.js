const socket = io();

const sessionId = window.location.pathname.split("/session/")[1];

const joinModal = document.getElementById("joinModal");
const joinBtn = document.getElementById("joinBtn");

const nameInput = document.getElementById("nameInput");
const roleInput = document.getElementById("roleInput");

const usersDiv = document.getElementById("users");
const resultsDiv = document.getElementById("results");

const revealBtn = document.getElementById("revealBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyLink");

const voteButtonsDiv = document.getElementById("voteButtons");

const voteValues = [1, 2, 3, 5, 8];

let role = null;
let selectedVote = null;

function renderVoteButtons() {
  if (role !== "player") {
    voteButtonsDiv.innerHTML =
      "<p>Observers cannot vote.</p>";
    return;
  }

  voteButtonsDiv.className = "vote-grid";

  voteButtonsDiv.innerHTML = "";

  voteValues.forEach(value => {
    const btn = document.createElement("button");

    btn.className = "vote-btn";

    if (selectedVote === value) {
      btn.classList.add("selected");
    }

    btn.textContent = value;

    btn.onclick = () => {
      selectedVote = value;

      socket.emit("cast-vote", {
        sessionId,
        vote: value
      });

      renderVoteButtons();
    };

    voteButtonsDiv.appendChild(btn);
  });
}

joinBtn.onclick = () => {
  const name = nameInput.value.trim();

  if (!name) return;

  role = roleInput.value;

socket.on("connect", () => {
  socket.emit("join-session", {
    sessionId,
    name,
    role
  });
});

  joinModal.style.display = "none";

  renderVoteButtons();
};

copyBtn.onclick = async () => {
  await navigator.clipboard.writeText(location.href);
  alert("Invite link copied");
};

revealBtn.onclick = () => {
  socket.emit("reveal-votes", {
    sessionId
  });
};

clearBtn.onclick = () => {
  selectedVote = null;

  socket.emit("clear-votes", {
    sessionId
  });

  renderVoteButtons();
};

socket.on("session-missing", () => {
  alert("Session no longer exists.");
  location.href = "/";
});

socket.on("state-update", state => {
  usersDiv.innerHTML = "";

  state.users.forEach(user => {
    const row = document.createElement("div");

    row.className = "user-row";

    let status;

    if (user.role === "observer") {
      status = "👁 Observer";
    } else if (state.revealed) {
      status = user.vote ?? "-";
    } else {
      status = user.hasVoted
        ? "✓ voted"
        : "waiting";
    }

    row.innerHTML = `
      <span>${user.name}</span>
      <span>${status}</span>
    `;

    usersDiv.appendChild(row);
  });

  resultsDiv.innerHTML = "";

  if (!state.revealed) {
    resultsDiv.innerHTML =
      "<p>Votes are hidden.</p>";
    return;
  }

  const votes = [];

  state.users.forEach(user => {
    if (
      user.role === "player" &&
      typeof user.vote === "number"
    ) {
      votes.push(user.vote);

      const div = document.createElement("div");

      div.className = "user-row";

      div.innerHTML = `
        <span>${user.name}</span>
        <span>${user.vote}</span>
      `;

      resultsDiv.appendChild(div);
    }
  });

  if (votes.length) {
    const avg =
      votes.reduce((a, b) => a + b, 0) /
      votes.length;

    const avgDiv = document.createElement("div");

    avgDiv.className = "average";

    avgDiv.textContent =
      "Average: " + avg.toFixed(2);

    resultsDiv.appendChild(avgDiv);
  }
});