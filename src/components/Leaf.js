import React, { Component } from "react";

class Leaf extends Component {
  state = {
    leafValue: this.props.option.name || ""
  };

  changeLeafValue = e => {
    this.setState({
      leafValue: e.target.value
    });
  };

  handleKeyDown = e => {
    if (e.key === "Enter") {
      this.props.addToBranch(
        this.props.branchIndex,
        this.props.option.id
          ? { ...this.props.option, name: this.state.leafValue }
          : this.state.leafValue
      );
    }
  };

  handleBlur = () => {
    this.props.addToBranch(
      this.props.branchIndex,
      this.props.option.id
        ? { ...this.props.option, name: this.state.leafValue }
        : this.state.leafValue
    );
  };

  render() {
    const { branchIndex, option, showBranch } = this.props;
    const { leafValue } = this.state;
    return (
      <div className="es-leaf" onClick={() => showBranch(branchIndex, option)}>
        <input
          className="es-leaf_input"
          type="text"
          value={leafValue}
          onChange={this.changeLeafValue}
          onKeyDown={this.handleKeyDown}
          onBlur={this.handleBlur}
        />
      </div>
    );
  }
}

export default Leaf;
