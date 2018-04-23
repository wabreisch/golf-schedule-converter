import React, { Component } from "react";

class DragArea extends Component {
  render() {
    return (
      <div
        className={
          this.props.hover ? `${this.props.type} hover` : `${this.props.type}`
        }
        onDragOver={this.props.onDragOver}
        onDrop={this.props.onDrop}
        onDragLeave={this.props.onDragLeave}
      >
        <p>{this.props.labelContent}</p>
      </div>
    );
  }
}

export default DragArea;
