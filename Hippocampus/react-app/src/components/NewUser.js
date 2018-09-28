import React, { Component } from 'react';
import './NewUser.css';

class NewUser extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        username: "",
        firstname: "",
        lastname:"",
        password:""
      },
      reppassword: "",
      submitted: false,
      error: ""
    }
    this.handleUChange = this.handleUChange.bind(this);
    this.handleFChange = this.handleFChange.bind(this);
    this.handleLChange = this.handleLChange.bind(this);
    this.handlePChange = this.handlePChange.bind(this);
    this.handlePPChange = this.handlePPChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (event) {
    event.preventDefault();
    this.setState({error:""});
    if(this.state.formData.password==this.state.reppassword)
    {
       fetch('http://localhost:8080/user/', {
       method: 'POST',
       body: JSON.stringify(this.state.formData),
     })
        .then(response => {
          if(response.status >= 200 && response.status < 300)
            this.setState({submitted: true});
            window.location = 'http://localhost:3000/Login';
        });
    }
    else {
      {
        this.setState({error:"Passwords entered do not match!"});
      }
    }
}

  handleUChange(event) {
    this.state.formData.username = event.target.value;
  }
  handleFChange(event) {
    this.state.formData.firstname = event.target.value;
  }
  handleLChange(event) {
    this.state.formData.lastname = event.target.value;
  }
  handlePChange(event) {
    this.state.formData.password = event.target.value;
  }
  handlePPChange(event) {
    this.setState({
      reppassword:event.target.value
    });
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <p className="App-title">Register</p>
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
                <label>First Name</label>
                <input type="text" placeholder="First Name" className="form-control" value={this.state.firstname} onChange={this.handleFChange} required/>
            </div>

            <div className="form-group">
                <label>Last Name</label>
                <input type="text" placeholder="Last Name" className="form-control" value={this.state.lastname} onChange={this.handleLChange} required/>
            </div>

            <div className="form-group">
                <label>Password</label>
                <input type="text" placeholder="Password" className="form-control" value={this.state.password} onChange={this.handlePChange} required/>
            </div>

            <div className="form-group">
                <label> Repeat Password</label>
                <input type="text" placeholder="Repeat Password" className="form-control" value={this.state.reppassword} onChange={this.handlePPChange} required/>
            </div>

            <button className="btn btn-primary btn-lg" type="submit">Submit</button>

          </form>
       </div>
+
      </div>
    );
  }
}

export default NewUser;
