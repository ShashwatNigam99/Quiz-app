import React, { Component } from 'react';
import './View.css';

class Performance extends Component {
  constructor() {
    super();
    this.state = {
      perfs : []
    }
  }

  // componentDidMount() {
  //     const request = new Request('http://127.0.0.1:8080/leader/'+this.props.match.params.genrename);
  //     fetch(request)
  //       .then(response => response.json())
  //         .then(lboard => this.setState({lboard:lboard}));
  //   }

  // Lifecycle hook, runs after component has mounted onto the DOM structure
componentDidMount() {
    const request = new Request('http://127.0.0.1:8080/performance/'+sessionStorage.getItem("userIDLoggedIn"));
    fetch(request)
      .then(response => response.json())
        .then(perfs => this.setState({perfs:perfs}));
  }

  render() {
    return (
      <div className="App">

        <header className="App-header">
          <h1 className="App-title">Performance</h1>
        </header>

      <div className="container">
        <form onSubmit={this.handleSubmit}>
            <div className="table-responsive">
              <table className="table table-hover table-bordered table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th>Quiz Name</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>{this.state.perfs.map(function(item, key)
                  {
                     return (
                        <tr key = {key}>
                            <td>{item.quiz_name}</td>
                            <td>{item.score}</td>
                        </tr>
                      )
                   }, this)}
                </tbody>
             </table>
           </div>
        </form>
      </div>

      </div>
    );
  }
}
export default Performance;
