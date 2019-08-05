import React, { Component } from "react";
import Leaf from "./Leaf";

class Branch extends Component {
  state = {
    branchValue: "",
    branchHeading: undefined
  };

  handleInputChange = e => {
    if (e.target.name === "branchValue") {
      this.setState({
        branchValue: e.target.value
      });
    }

    if (e.target.name === "branchHeading") {
      this.setState({
        branchHeading: e.target.value
      });
    }
  };

  handleKeyDown = e => {
    if (e.key === "Enter" && e.target.name === "branchValue") {
      this.props.addToBranch(this.props.branchIndex, this.state.branchValue);
      this.setState({ branchValue: "" });
    }

    if (e.key === "Enter" && e.target.name === "branchHeading") {
      this.props.createBranchheading(
        this.props.branchIndex,
        this.props.heading
          ? { ...this.props.heading, title: this.state.branchHeading }
          : this.state.branchHeading
      );
    }
  };

  handleBlur = () => {
    this.props.createBranchheading(
      this.props.branchIndex,
      this.props.heading
        ? { ...this.props.heading, title: this.state.branchHeading }
        : this.state.branchHeading
    );
  };

  render() {
    const { branchValue, branchHeading } = this.state;
    const {
      options,
      branches,
      branchIndex,
      showBranch,
      addToBranch,
      removeFromBranch,
      heading
    } = this.props;
    return (
      <div className="es-branch">
        <div className="es-branch_header">
          <input
            value={branchHeading || (heading || "").title || ""}
            type="text"
            name="branchHeading"
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
            onBlur={this.handleBlur}
          />
        </div>
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
            name="branchValue"
            type="text"
            value={branchValue}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
          />
        </span>
      </div>
    );
  }
}

export default Branch;
