import React, { Component } from 'react';
import './View.css';

class ViewUsers extends Component {
  constructor() {
    super();
    this.state = {
      users : [],
    }
  }

  // Lifecycle hook, runs after component has mounted onto the DOM structure
componentDidMount() {
    const request = new Request('http://127.0.0.1:8080/user/');
    fetch(request)
      .then(response => response.json())
        .then(users => this.setState({users:users}));
  }

  render() {
    return (
      <div className="App">

        <header className="App-header">
          <h1 className="App-title">View all users</h1>
        </header>

      <div className="container">
        <form onSubmit={this.handleSubmit}>
            <div className="table-responsive">
              <table className="table table-hover table-bordered table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th>User Name</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Admin</th>
                  </tr>
                </thead>
                <tbody>{this.state.users.map(function(item, key)
                  {
                     return (
                        <tr key = {key}>
                            <td>{item.username}</td>
                            <td>{item.firstname}</td>
                            <td>{item.lastname}</td>
                            <td>{String(item.isadmin)}</td>
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
export default ViewUsers;
