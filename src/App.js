import React, { Component } from "react";
import Branch from "./components/Branch";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: [],
      branches: []
    };
  }

  showBranch = (branchIndex, branch) => {
    let newBranches = [...this.state.branches];
    newBranches.splice(branchIndex, 1, branch);

    this.setState({
      branches: newBranches.slice(0, branchIndex + 1)
    });
  };

  addToBranch = (branchIndex, value) => {
    if (branchIndex === 0) {
      this.setState({
        options:
          typeof value === "object"
            ? this.state.options.map(opt => (opt.id === value.id ? value : opt))
            : [
                ...this.state.options,
                { id: Date.now(), key: value, name: value, values: [] }
              ]
      });
    } else {
      let activeBranch = this.state.branches[branchIndex - 1];
      let newBranch = {
        ...activeBranch,
        values:
          typeof value === "object"
            ? (activeBranch.values || []).map(val =>
                val.id === value.id ? value : val
              )
            : [
                ...(activeBranch.values || []),
                { id: Date.now(), key: value, name: value, values: [] }
              ]
      };

      // console.log(newBranch);

      let newBranches = [...this.state.branches];
      newBranches.splice(branchIndex - 1, 1, newBranch);
      // console.log(newBranches);
      let reversedBranches = [...newBranches].reverse();
      // console.log(reversedBranches);
      let newRootBase = reversedBranches.reduce((acc, cur) => {
        if (!acc["branches"]) acc["branches"] = [];

        if (acc["option"]) {
          let newVals = cur["values"].map(val =>
            val.id === acc["option"].id ? acc["option"] : val
          );
          acc["option"] = { ...cur, values: newVals };
          acc["branches"].push({ ...cur, values: newVals });
        } else {
          acc["option"] = typeof value === "object" ? value : cur;
          acc["branches"].push(typeof value === "object" ? value : cur);
        }

        return acc;
      }, {});
      this.setState(
        {
          branches: [...newRootBase["branches"].reverse()],
          options: this.state.options.map(opt =>
            opt.id === newRootBase["option"].id ? newRootBase["option"] : opt
          )
        },
        () => {
          // console.log(this.state.branches);
          // console.log(this.state.options);
        }
      );
    }
  };

  render() {
    const { options, branches } = this.state;
    return (
      <div className="es-tree">
        {Array.isArray(options) && (
          <Branch
            branchIndex={0}
            showBranch={this.showBranch}
            options={options}
            addToBranch={this.addToBranch}
          />
        )}
        {Array.isArray(options) &&
          branches.length > 0 &&
          branches.map((branch, index) => (
            <Branch
              addToBranch={this.addToBranch}
              key={branch.id}
              showBranch={this.showBranch}
              options={branch.values || []}
              branchIndex={index + 1}
            />
          ))}
      </div>
    );
  }
}

export default App;
