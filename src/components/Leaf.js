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
          // onBlur={() => console.log("i blurred")}
        />
      </div>
    );
  }
}

export default Leaf;
