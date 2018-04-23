import React, { Component } from "react";
import DragArea from "./DragArea";
import "./App.css";

class App extends Component {
  state = {
    rosterHover: false,
    scheduleHover: false,
    rosterContent: "",
    scheduleContent: "",
    editedScheduleContent: ""
  };

  submitFiles = () => {
    fetch("api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        roster: this.state.rosterContent,
        schedule: this.state.scheduleContent
      })
    })
      .then(res => res.json())
      .then(res => {
        this.setState({
          editedScheduleContent: res.editedSchedule
        });

        setTimeout(() => {
          document.getElementById("download").click();
        }, 250);
      });

    this.setState({
      rosterContent: "",
      scheduleContent: ""
    });
  };

  onRosterDrop = e => {
    e.preventDefault();
    this.setState({ rosterHover: false });

    if (e.dataTransfer.items) {
      let fileReader = new FileReader();

      fileReader.onload = data => {
        const res = data.currentTarget.result;
        this.setState({ rosterContent: res });
      };

      if (e.dataTransfer.items[0].kind === "file") {
        let file = e.dataTransfer.items[0].getAsFile();
        fileReader.readAsText(file);
      }
    }
  };

  onRosterDragOver = e => {
    e.preventDefault();
    this.setState({ rosterHover: true });
  };

  onRosterDragLeave = e => {
    e.preventDefault();
    this.setState({ rosterHover: false });
  };

  onScheduleDrop = e => {
    e.preventDefault();
    this.setState({ scheduleHover: false });

    if (e.dataTransfer.items) {
      let fileReader = new FileReader();

      fileReader.onload = data => {
        const res = data.currentTarget.result;
        this.setState({ scheduleContent: res });
      };

      if (e.dataTransfer.items[0].kind === "file") {
        let file = e.dataTransfer.items[0].getAsFile();
        fileReader.readAsText(file);
      }
    }
  };

  onScheduleDragOver = e => {
    e.preventDefault();
    this.setState({ scheduleHover: true });
  };

  onScheduleDragLeave = e => {
    e.preventDefault();
    this.setState({ scheduleHover: false });
  };

  render() {
    return (
      <div className="App">
        <DragArea
          type="roster"
          onDragOver={this.onRosterDragOver}
          onDrop={this.onRosterDrop}
          onDragLeave={this.onRosterDragLeave}
          hover={this.state.rosterHover}
          labelContent={this.state.rosterContent ? "✔️ Roster" : "Drag roster here"}
        />
        <DragArea
          type="schedule"
          onDragOver={this.onScheduleDragOver}
          onDrop={this.onScheduleDrop}
          onDragLeave={this.onScheduleDragLeave}
          hover={this.state.scheduleHover}
          labelContent={this.state.scheduleContent ? "✔️ Schedule" : "Drag schedule here"}
        />

        <button
          className="submit"
          disabled={!this.state.rosterContent || !this.state.scheduleContent}
          onClick={this.submitFiles}
        >
          Submit
        </button>

        <a
          id="download"
          href={`${"data:text/plain;charset=utf-8,"}${encodeURIComponent(
            this.state.editedScheduleContent
          )}`}
          style={{ display: "none" }}
          download="EditedSchedule.html"
        />
      </div>
    );
  }
}

export default App;
