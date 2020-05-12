const PORT = 7777;
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const domino = require("domino");
const groupBy = require("lodash/groupBy");

const app = express();

app.use(express.static(path.join(__dirname, "build")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const reservedWords = [
  "Team",
  "Player",
  "Handicap",
  "Phone",
  "Substitutes",
].map((w) => w.toLocaleLowerCase());

const isRowPlayer = (row) => {
  let returnVal = true;
  const tdChildren = Array.from(row.children);
  const currRow = tdChildren
    .map((child) => {
      return child.querySelector("font").innerHTML;
    })
    .join(",");

  if (currRow.replace(/[,\s]*&nbsp;/gi, "").trim() === "") {
    returnVal = false;
  }

  reservedWords.forEach((w) => {
    if (currRow.toLocaleLowerCase().includes(w)) {
      returnVal = false;
    }
  });

  return returnVal;
};

const sanitizeHtml = (html) => {
  let newHtml = html.replace(/<script>/gi, "");
  newHtml = html.replace(/<\/script>/gi, "");
  return newHtml;
};

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.post("/api/submit", function (req, res) {
  let rosterWindow = domino.createWindow(
    sanitizeHtml(req.body.roster),
    "roster"
  );
  let rosterDocument = rosterWindow.document;
  let scheduleWindow = domino.createWindow(
    sanitizeHtml(req.body.schedule),
    "schedule"
  );
  let scheduleDocument = scheduleWindow.document;

  const allTrs = rosterDocument.querySelectorAll("tr");
  const players = [];

  Array.from(allTrs).forEach((tr, index) => {
    if (isRowPlayer(tr)) {
      players.push({
        team: tr.children[0].querySelector("font").innerHTML,
        name: tr.children[1].querySelector("font").innerHTML,
        handicap: tr.children[2].querySelector("font").innerHTML,
        homePhone: tr.children[3].querySelector("font").innerHTML,
        workPhone: tr.children[4].querySelector("font").innerHTML,
      });
    }
  });

  const groupedPlayers = groupBy(players, "team");
  const allScheduleTrs = scheduleDocument.querySelectorAll("tr");

  fs.writeFileSync("debug.json", JSON.stringify(groupedPlayers, null, 2));

  Array.from(allScheduleTrs).forEach((tr, index) => {
    Array.from(tr.children).forEach((child, childIndex) => {
      if (index > 0) {
        if (childIndex >= 4 && childIndex <= 7) {
          const res = tr.children[childIndex]
            .querySelector("fonts")
            .innerHTML.split("vs")
            .map((m) => {
              if (!groupedPlayers[m.trim()]) {
                return;
              }
              return groupedPlayers[m.trim()]
                .map((p) => {
                  const nameSplit = p.name
                    .split(",")
                    .map((name) => name.trim());
                  return `${nameSplit[1]} ${nameSplit[0]}`;
                })
                .join(" & ");
            })
            .join(" vs. ");

          tr.children[childIndex].innerHTML = res;
        }
      }
    });
  });

  const scheduleStyle = `
  <style>
  html {
    font-family: "Open Sans", sans-serif;
  }
  table {
    width: 100%;
  }
  table td {
    padding: 4px;
  }
  </style>
  `;

  res.json({
    editedSchedule: `${scheduleStyle}\n${scheduleDocument.innerHTML}`,
  });
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
