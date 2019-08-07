import React, { Component } from "react";
import Leaf from "./Leaf";

class Branch extends Component {
  state = {
    branchValue: "",
    branchHeading: (this.props.heading || "").title || undefined,
    branchTextAreaValue: undefined
  };

  handleInputChange = e => {
    if (e.target.name === "branchValue") {
      this.setState({
        branchValue: e.target.value
      });
    }

    if (e.target.name === "branchHeading") {
      this.setState(
        {
          branchHeading: e.target.value
        },
        () => this.state.branchHeading.length === 0 && this.handleBlur()
      );
    }
  };

  handleTextAreaChange = e => {
    this.setState({
      branchTextAreaValue: e.target.value
    });
  };

  handleKeyDown = e => {
    if (
      e.key === "Enter" &&
      e.target.name === "branchValue" &&
      this.state.branchValue.trim() !== ""
    ) {
      this.props.addToBranch(this.props.branchIndex, this.state.branchValue);
      this.setState({ branchValue: "" });
    }

    if (
      e.key === "Enter" &&
      e.target.name === "branchHeading" &&
      this.state.branchHeading.trim() !== ""
    ) {
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

  handleSubmitTextArea = () => {
    let hasLineBreaks = /\r|\n/.exec(this.state.branchTextAreaValue);

    if (hasLineBreaks) {
      let options = this.state.branchTextAreaValue
        .trim()
        .split("\n")
        .map(el => {
          return {
            id:
              this.props.branchIndex === 0
                ? `${Date.now() + setTimeout(null, 10)}`
                : `${
                    this.props.branches[this.props.branchIndex - 1].id
                  }-${Date.now() + setTimeout(null, 10)}`,
            name: el,
            key: el
              .toLowerCase()
              .split(" ")
              .join("_"),
            values: []
          };
        });

      this.props.addToBranch(this.props.branchIndex, options);

      clearTimeout();
    }
  };

  toggleTextArea = () => {
    this.setState({
      showTextArea: !this.state.showTextArea,
      branchTextAreaValue: undefined
    });
  };

  render() {
    const {
      branchValue,
      branchHeading,
      showTextArea,
      branchTextAreaValue
    } = this.state;
    const {
      options,
      branches,
      branchIndex,
      showBranch,
      addToBranch,
      removeFromBranch,
      heading,
      keyEdit
    } = this.props;

    return (
      <div className="es-branch">
        <div className="es-branch_header">
          <input
            value={branchHeading || (heading || "").title || ""}
            type="text"
            name="branchHeading"
            placeholder="Provide heading for this branch"
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
            onBlur={this.handleBlur}
          />
        </div>
        {!showTextArea && (
          <div className="es-branch_body">
            {options.map(option => (
              <Leaf
                key={option.id}
                keyEdit={keyEdit}
                showBranch={showBranch}
                branches={branches}
                addToBranch={addToBranch}
                branchIndex={branchIndex}
                removeFromBranch={removeFromBranch}
                option={option}
              />
            ))}
          </div>
        )}
        <span
          className="es-branch_footer"
          style={{
            flexDirection: showTextArea ? "column" : "row"
          }}
        >
          {!showTextArea && (
            <>
              <input
                className="es-leaf_input"
                name="branchValue"
                type="text"
                value={branchValue}
                onChange={this.handleInputChange}
                onKeyDown={this.handleKeyDown}
              />
              <button className="es-leaf_btn" onClick={this.toggleTextArea}>
                SW
              </button>
            </>
          )}
          {showTextArea && (
            <>
              <textarea
                placeholder="Provide list "
                value={branchTextAreaValue}
                onChange={this.handleTextAreaChange}
                className="es-leaf_textarea"
              />
              <>
                <button
                  className="es-leaf_btn"
                  onClick={this.toggleTextArea}
                  style={{
                    height: "40px",
                    width: "100%",
                    backgroundColor: "#dc493a",
                    color: "white"
                  }}
                >
                  cancel
                </button>{" "}
                <button
                  className="es-leaf_btn"
                  onClick={() => {
                    (branchTextAreaValue || "").trim() !== "" &&
                      this.toggleTextArea();
                    (branchTextAreaValue || "").trim() !== "" &&
                      this.handleSubmitTextArea();
                  }}
                  style={{
                    height: "40px",
                    width: "100%",
                    backgroundColor: "#5ca4a9",
                    color: "white"
                  }}
                >
                  done
                </button>
              </>
            </>
          )}
        </span>
      </div>
    );
  }
}

export default Branch;
