import React, { Component } from "react";
import Leaf from "./Leaf";

class Branch extends Component {
  state = {
    branchValue: ""
  };

  changeBranchValue = e => {
    this.setState({
      branchValue: e.target.value
    });
  };

  handleKeyDown = e => {
    if (e.key === "Enter") {
      this.props.addToBranch(this.props.branchIndex, this.state.branchValue);
      this.setState({ branchValue: "" });
    }
  };
  render() {
    const { branchValue } = this.state;
    const {
      options,
      branches,
      branchIndex,
      showBranch,
      addToBranch,
      removeFromBranch
    } = this.props;
    return (
      <div className="es-branch">
        <div className="es-branch_header" />
        <div className="es-branch_body">
          {options.map(option => (
            <Leaf
              key={option.id}
              showBranch={showBranch}
              branches={branches}
              addToBranch={addToBranch}
              branchIndex={branchIndex}
              removeFromBranch={removeFromBranch}
              option={option}
            />
          ))}
        </div>
        <span className="es-branch_footer">
          <input
            className="es-leaf_input"
            type="text"
            value={branchValue}
            onChange={this.changeBranchValue}
            onKeyDown={this.handleKeyDown}
          />
        </span>
      </div>
    );
  }
}

export default Branch;
