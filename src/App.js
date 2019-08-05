import React, { Component } from "react";
import Branch from "./components/Branch";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: JSON.parse(localStorage.getItem("options")) || [],
      branches: [],
      headings: JSON.parse(localStorage.getItem("headings")) || []
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
      this.setState(
        {
          options:
            typeof value === "object"
              ? this.state.options.map(opt =>
                  opt.id === value.id ? value : opt
                )
              : [
                  ...this.state.options,
                  { id: Date.now(), key: value, name: value, values: [] }
                ]
        },
        () =>
          localStorage.setItem("options", JSON.stringify(this.state.options))
      );
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
                {
                  id: `${activeBranch.id}-${Date.now()}`,
                  key: value,
                  name: value,
                  values: []
                }
              ]
      };

      let newBranches = [...this.state.branches];
      newBranches.splice(branchIndex - 1, 1, newBranch);

      let reversedBranches = [...newBranches].reverse();

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
        () =>
          localStorage.setItem("options", JSON.stringify(this.state.options))
      );
    }
  };

  removeFromBranch = (branchIndex, value) => {
    if (branchIndex === 0) {
      this.setState(
        state => {
          return {
            options: state.options.filter(opt => opt.id !== value.id)
          };
        },
        () => {
          this.setState({
            branches: []
          });
          localStorage.setItem("options", JSON.stringify(this.state.options));
        }
      );
    } else {
      let activeBranch = this.state.branches[branchIndex - 1];
      let newBranch = {
        ...activeBranch,
        values: (activeBranch.values || []).filter(val => val.id !== value.id)
      };

      let newBranches = this.state.branches.slice();
      newBranches.splice(branchIndex - 1, 1, newBranch);

      let reversedBranches = newBranches.slice().reverse();

      let newRootBase = reversedBranches.reduce((acc, cur) => {
        if (!acc["branches"]) acc["branches"] = [];

        if (acc["option"] && value.id !== cur.id) {
          let newVals = cur["values"].map(val =>
            val.id === acc["option"].id ? acc["option"] : val
          );
          acc["option"] = { ...cur, values: newVals };
          acc["branches"].push({ ...cur, values: newVals });
        }
        if (!acc["option"] && value.id !== cur.id) {
          acc["option"] = cur;
          acc["branches"].push(cur);
        }

        return acc;
      }, {});

      newRootBase["branches"].reverse();

      this.setState(
        state => {
          return {
            options: state.options.map(opt =>
              opt.id === newRootBase["option"].id ? newRootBase["option"] : opt
            )
          };
        },
        () => {
          this.setState({
            branches: newRootBase["branches"]
          });
          localStorage.setItem("options", JSON.stringify(this.state.options));
        }
      );
    }
  };

  createBranchheading = (branchIndex, value) => {
    if (typeof value === "object") {
      this.setState(
        state => {
          return {
            headings: state.headings.map(head =>
              head.id === value.id ? value : head
            )
          };
        },
        () =>
          localStorage.setItem("headings", JSON.stringify(this.state.headings))
      );
    }

    if (typeof value === "string") {
      this.setState(
        state => ({
          headings: [...state.headings, { id: branchIndex, title: value }]
        }),
        () =>
          localStorage.setItem("headings", JSON.stringify(this.state.headings))
      );
    }
  };

  render() {
    const { options, branches, headings } = this.state;

    return (
      <div className="es-tree">
        {Array.isArray(options) && (
          <Branch
            branchIndex={0}
            heading={headings[0]}
            showBranch={this.showBranch}
            options={options}
            branches={branches}
            addToBranch={this.addToBranch}
            createBranchheading={this.createBranchheading}
            removeFromBranch={this.removeFromBranch}
          />
        )}
        {Array.isArray(options) &&
          branches.length > 0 &&
          branches.map((branch, index) => (
            <Branch
              removeFromBranch={this.removeFromBranch}
              addToBranch={this.addToBranch}
              key={branch.id}
              heading={headings[index + 1]}
              branches={branches}
              createBranchheading={this.createBranchheading}
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
