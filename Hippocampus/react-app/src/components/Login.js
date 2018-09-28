import React, { Component } from 'react';
import './NewUser.css';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        username: "",
        password: ""
      },
      error:""
    }
    this.handleUChange = this.handleUChange.bind(this);
    this.handlePChange = this.handlePChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (event) {

    event.preventDefault();
    this.setState({error:""});
   console.log(this.state.formData);
   fetch('http://localhost:8080/user/login', {
       method: 'POST',
       body: JSON.stringify(this.state.formData),
     })
        .then(response =>
          // {
          // if(response.status >= 200 && response.status < 300){
                           response.json()
                         // }
                   )
            .then(user =>{
               sessionStorage.setItem('isLoggedIn',"true");
               sessionStorage.setItem('userNameLoggedIn',String(user.username));
               sessionStorage.setItem('userIDLoggedIn',String(user.userid));
               sessionStorage.setItem('userIsAdmin',String(user.isadmin));
               window.location = 'http://localhost:3000/';
          });
    }

//
  handleUChange(event) {
    this.state.formData.username = event.target.value;
  }
  handlePChange(event) {
    this.state.formData.password = event.target.value;
  }

  render() {

    return (

      <div className="App">

        <header className="App-header">
          <p className="App-title">Login</p>
        </header>

        { this.state.error &&
          <div class="alert alert-danger" role="alert">{this.state.error}</div>
        }

        <div className="formContainer">
          <form onSubmit={this.handleSubmit}>

            <div className="form-group">
               <label>User Name</label>
               <input type="text" placeholder="Username" className="form-control" value={this.state.username} onChange={this.handleUChange} required/>
            </div>

            <div className="form-group">
                <label>Password</label>
                <input type="text" placeholder="Password" className="form-control" value={this.state.password} onChange={this.handlePChange} required/>
            </div>

            <button className="btn btn-primary btn-lg" type="submit">Login</button>

          </form>
       </div>
    </div>
    );
  }
}

export default Login;
