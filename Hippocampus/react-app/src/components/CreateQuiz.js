import React, { Component } from 'react';
import './View.css';

class CreateQuiz extends Component {
  constructor() {
    super();
    this.state = {
      formData:{
      quizname : ""
    },
      submitted: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

handleChange(event) {
  this.state.formData.quizname = event.target.value;
  }

handleSubmit(event){
    event.preventDefault();
    fetch('http://localhost:8080/genre/'+this.props.match.params.genrename, {
    method:'POST',
    body: JSON.stringify(this.state.formData),
    })
     .then(response =>{
         if(response.status >=200 && response.status <300){
         this.setState({submitted:true});
         this.setState({quizname :""});
         }
      });
   }
  // Lifecycle hook, runs after component has mounted onto the DOM structure

  render() {
    return (
      <div className="App">

        <header className="App-header">
          <h1 className="App-title">Create a new Quiz</h1>
          <h3 >Genre: {this.props.match.params.genrename}</h3>
        </header>

      <div className="container">

         <form className="form-horizontal" onSubmit={this.handleSubmit}>
              <div className="form-group">
                  <div className="col-sm-1 col-lg-1"></div>
                  <label className="control-label col-sm-4">Enter name of Quiz :</label>
                  <div className="col-sm-5">
                       <input type="text" className="form-control" placeholder="Enter Quiz Name" value={this.state.genrename} onChange={this.handleChange} required/>
                  </div>
              </div>
              <div className="form-group">
                  <div className="col-sm-12 col-lg-12">
                      <br/>
                      <button type="submit" className="btn btn-success btn-lg">Create Quiz</button>
                  </div>
              </div>
        </form>
        {this.state.submitted &&
          <div>
            <h2>
              New Quiz successfully created.
            </h2>
          </div>
        }
    </div>
   </div>
  );
 }
}
export default CreateQuiz;
