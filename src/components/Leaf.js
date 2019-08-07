import React, { Component } from "react";

class Leaf extends Component {
  state = {
    leafValue:
      this.props.option[`${this.props.keyEdit ? "key" : "name"}`] || "",
    confirm: false
  };

  // componentDidMount() {
  //   console.log("mounted");
  // }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.keyEdit && prevState.leafValue === nextProps.option.name) {
      return {
        leafValue: nextProps.option.key
      };
    }

    if (!nextProps.keyEdit && prevState.leafValue !== nextProps.option.name) {
      return {
        leafValue: nextProps.option.name
      };
    }

    return null;
  }

  changeLeafValue = e => {
    this.setState({
      leafValue: e.target.value
    });
  };

  handleKeyDown = e => {
    if (e.key === "Enter" && this.state.leafValue.trim() !== "") {
      this.props.addToBranch(
        this.props.branchIndex,
        this.props.option.id
          ? { ...this.props.option, name: this.state.leafValue }
          : this.state.leafValue
      );
    }
  };

  handleDeleteConfirm = confirm => {
    this.setState({
      confirm
    });
  };

  handleBlur = () => {
    this.props.addToBranch(
      this.props.branchIndex,
      this.props.option.id
        ? { ...this.props.option, name: this.state.leafValue }
        : this.state.leafValue,
      "blur"
    );
  };

  deleteItem = () => {
    this.props.removeFromBranch(this.props.branchIndex, {
      ...this.props.option,
      name: this.state.leafValue
    });
  };

  render() {
    const { branchIndex, option, showBranch, branches, keyEdit } = this.props;
    const { leafValue, confirm } = this.state;
    return (
      <div
        className={`es-leaf 
        ${
          option &&
          branches.length > 0 &&
          branches[branchIndex] &&
          branches[branchIndex].id === option.id
            ? "es-leaf_active"
            : ""
        }
        `}
        onClick={() => showBranch(branchIndex, option)}
      >
        {confirm && (
          <div className="es-leaf_confirm">
            <p>
              Delete this value?{" "}
              <span onClick={() => this.handleDeleteConfirm(false)}>No</span>
              <span
                onClick={() => {
                  this.deleteItem();
                  this.handleDeleteConfirm(false);
                }}
              >
                Yes
              </span>{" "}
            </p>
          </div>
        )}
        <input
          className="es-leaf_input"
          type="text"
          value={leafValue}
          onChange={this.changeLeafValue}
          onKeyDown={this.handleKeyDown}
          onBlur={this.handleBlur}
          onFocus={() => showBranch(branchIndex, option)}
        />
        <button
          className="es-leaf_btn"
          onClick={() => this.handleDeleteConfirm(true)}
        >
          Del
        </button>
      </div>
    );
  }
}

export default Leaf;
