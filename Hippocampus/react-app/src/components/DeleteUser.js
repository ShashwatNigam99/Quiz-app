import React, { Component } from 'react';
import './DeleteUser.css';

class DeleteUser extends Component {
  constructor() {
    super();
    this.state = {
      users : [],
      selectedOption : null
    }
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Lifecycle hook, runs after component has mounted onto the DOM structure
componentDidMount() {
    const request = new Request('http://127.0.0.1:8080/user/');
    fetch(request)
      .then(response => response.json())
        .then(users => this.setState({users:users}));
  }

handleOptionChange(event) {
      this.setState({
        selectedOption: event.target.value
      });
    }

handleSubmit (event) {
      event.preventDefault();
      // window.alert('http://localhost:8080/user/'+this.state.selectedOption)
      fetch('http://localhost:8080/user/'+this.state.selectedOption , {
       method: 'DELETE',
     })
        .then(response => {
          if(response.status >= 200 && response.status < 300)
            this.setState({selectedOption:null});
            this.componentDidMount();
        });
    }


  render() {
    return (
      <div className="App">

        <header className="App-header">
          <h1 className="App-title">Delete a person</h1>
        </header>

      <div className="container">
        <form onSubmit={this.handleSubmit}>
            <div className="table-responsive deltable">
              <table className="table table-hover table-bordered table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th>User Name</th>
                    <th>Select User</th>
                  </tr>
                </thead>
                <tbody>{this.state.users.map(function(item, key)
                  {
                     return (
                        <tr key = {key}>
                            <td>{item.username}</td>
                            <td><input type="radio"
                                 value={item.userid}
                                 checked={this.state.selectedOption == item.userid}
                                 onChange={this.handleOptionChange}/>
                            </td>
                        </tr>
                      )
                   }, this)}
                </tbody>
             </table>
           </div>
           <br/><br/>
           <input type="submit" value="Delete User" className="sbmtBtn"></input>
        </form>
      </div>

      </div>
    );
  }
}
export default DeleteUser;
