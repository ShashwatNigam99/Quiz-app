import React, { Component } from 'react';
import './View.css';

class LeaderBoard extends Component {
  constructor() {
    super();
    this.state = {
      lboard : []
    }
  }

  // Lifecycle hook, runs after component has mounted onto the DOM structure
componentDidMount() {
    const request = new Request('http://127.0.0.1:8080/leader/'+this.props.match.params.genrename);
    fetch(request)
      .then(response => response.json())
        .then(lboard => this.setState({lboard:lboard}));
  }

  render() {
    return (
      <div className="App">

        <header className="App-header">
          <h1 className="App-title">Leaderboard</h1>
        </header>

      <div className="container">
        <form onSubmit={this.handleSubmit}>
            <div className="table-responsive">
              <table className="table table-hover table-bordered table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th>User Name</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>{this.state.lboard.map(function(item, key)
                  {
                     return (
                        <tr key = {key}>
                            <td>{item.user_name}</td>
                            <td>{item.total_score}</td>
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
export default LeaderBoard;
