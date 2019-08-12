import React, { Component } from "react";
import Branch from "./components/Branch";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: JSON.parse(localStorage.getItem("options")) || [],
      branches: [],
      headings: JSON.parse(localStorage.getItem("headings")) || [],
      keyEdit: false
    };
  }

  showBranch = (branchIndex, branch) => {
    let esTree = document.getElementById("es-tree");

    let newBranches = [...this.state.branches];
    newBranches.splice(branchIndex, 1, branch);

    this.setState(
      {
        branches: newBranches.slice(0, branchIndex + 1)
      },
      () => {
        esTree.scrollLeft = esTree.scrollWidth;
      }
    );
  };

  addToBranch = (branchIndex, value, action) => {
    let activeDiv = document.getElementsByClassName("es-branch_body");

    if (branchIndex === 0) {
      if (Array.isArray(value)) {
        return this.setState(
          {
            options: [...this.state.options, ...value]
          },
          () => {
            localStorage.setItem("options", JSON.stringify(this.state.options));
            activeDiv[0].scrollTop =
              action !== "blur" && activeDiv[0].scrollHeight;
          }
        );
      }
      if (typeof value === "object") {
        return this.setState(
          {
            options: this.state.options.map(opt =>
              opt.id === value.id ? value : opt
            )
          },
          () => {
            localStorage.setItem("options", JSON.stringify(this.state.options));
            activeDiv[0].scrollTop =
              action !== "blur" && activeDiv[0].scrollHeight;
          }
        );
      }

      if (typeof value === "string") {
        return this.setState(
          {
            options: [
              ...this.state.options,
              { id: Date.now(), key: value, name: value, values: [] }
            ]
          },
          () => {
            localStorage.setItem("options", JSON.stringify(this.state.options));
            activeDiv[0].scrollTop =
              action !== "blur" && activeDiv[0].scrollHeight;
          }
        );
      }
    } else {
      let activeBranch = this.state.branches[branchIndex - 1];
      let newBranch = {
        ...activeBranch,
        values: Array.isArray(value)
          ? [...(activeBranch.values || []), ...value]
          : typeof value === "object"
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
          acc["option"] = Array.isArray(value)
            ? cur
            : typeof value === "object"
            ? value
            : cur;
          acc["branches"].push(
            Array.isArray(value) ? cur : typeof value === "object" ? value : cur
          );
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
          localStorage.setItem("options", JSON.stringify(this.state.options));
          activeDiv[branchIndex].scrollTop =
            action !== "blur" && activeDiv[branchIndex].scrollHeight;
        }
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

  toggleEditKeys = e => {
    console.log("toggle");
    this.setState({
      keyEdit: e.target.checked
    });
    this.forceUpdate();
  };

  render() {
    const { options, branches, headings, keyEdit, loading } = this.state;

    return (
      <>
        {/* <span>
          <input
            type="checkbox"
            name="keyEdit"
            value={keyEdit}
            onChange={this.toggleEditKeys}
          />
          Edit keys
        </span> */}
        <div id="es-tree" className="es-tree">
          {loading && (
            <div className="es-tree-loader">
              <div>
                <div className="loader" />
                <p>Loading...</p>
              </div>
            </div>
          )}
          {Array.isArray(options) && (
            <Branch
              branchIndex={0}
              keyEdit={keyEdit}
              heading={headings[0]}
              showBranch={this.showBranch}
              options={options}
              branches={branches}
              addToBranch={this.addToBranch}
              createBranchheading={this.createBranchheading}
              removeFromBranch={this.removeFromBranch}
            />
          )}
          {Array.isArray(options) && branches.length > 0 ? (
            branches.map((branch, index) => (
              <Branch
                removeFromBranch={this.removeFromBranch}
                addToBranch={this.addToBranch}
                key={branch.id}
                keyEdit={keyEdit}
                heading={headings[index + 1]}
                branches={branches}
                createBranchheading={this.createBranchheading}
                showBranch={this.showBranch}
                options={branch.values || []}
                branchIndex={index + 1}
              />
            ))
          ) : (
            <div className="es-tree--empty-instructions">
              <div>
                <p>
                  Create your list of items by typing into the input field in
                  the bottom left corner
                </p>
                <p>
                  of this widget. To enter multiple lines of text click the "SW"
                  button
                </p>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default App;
