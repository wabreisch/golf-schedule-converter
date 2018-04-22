import React, { Component } from "react";

import "./ConfigFileDiff.css";

class ConfigFileDiff extends Component {
  state = {
    hovering: false
  };

  validFileExtensions = ["xml", "config"];

  handleDragOver = e => {
    e.preventDefault();
    this.setState({ hovering: true });
  };
  handleDragLeave = e => {
    e.preventDefault();
    this.setState({ hovering: false });
  };

  handleDrop = e => {
    e.preventDefault();
    this.setState({ hovering: false });

    if (e.dataTransfer.items) {
      let fileReader = new FileReader();

      fileReader.onload = data => {
        const res = data.currentTarget.result;
        fetch("api/test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ fileContent: res })
        });
      };

      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        if (e.dataTransfer.items[i].kind === "file") {
          let file = e.dataTransfer.items[i].getAsFile();
          let splitFileName = file.name.split(".");
          let splitFileNameLength = splitFileName.length;

          if (
            this.validFileExtensions.indexOf(
              splitFileName[splitFileNameLength - 1].toLowerCase()
            ) >= 0
          ) {
            fileReader.readAsText(file);
          } else {
            console.error(
              `Invalid file extension: ${
                splitFileName[splitFileNameLength - 1]
              }`
            );
          }
        }
      }
    }
  };

  render() {
    return (
      <div className="container">
        <div className="drop-grid">
          <div
            className={this.state.hovering ? "left hovering" : "left"}
            onDragOver={this.handleDragOver}
            onDrop={this.handleDrop}
            onDragLeave={this.handleDragLeave}
          >
            Drag a config file here...
          </div>
          <div className="right">R</div>
        </div>
      </div>
    );
  }
}

export default ConfigFileDiff;
