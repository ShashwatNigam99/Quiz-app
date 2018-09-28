import React, { Component } from 'react';
import './View.css';

class CreateQuestion extends Component {
  constructor() {
    super();
    this.state = {
      formDataQ:{
      question : ""
      },
  optname : "",
  isChecked:false,
  show_options : false,
  num_q : 4,
  cur_q : 1
  }
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeOption = this.handleChangeOption.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleSubmitQ = this.handleSubmitQ.bind(this);
    this.getCurNumQ = this.getCurNumQ.bind(this)
    this.setNumQ = this.setNumQ.bind(this)
    this.handleSubmitOption = this.handleSubmitOption.bind(this);
  }

componentDidMount() {
  this.setState({
    formDataQ:{
    question : ""
    },
    optname : "",
    isChecked : false,
    show_options : false,
    num_q : 4,
    cur_q :1,
  });
}

handleChange(event) {
    this.state.formDataQ.question = event.target.value;
    }

handleChangeOption(event){
  event.preventDefault()
  this.setState({optname:event.target.value});
}

handleOptionChange(event){
  var x = this.state.isChecked;
  console.log(x);
  var y = !x;
  console.log(y);
  this.setState({isChecked: y});
}

getCurNumQ = () => {
  return this.state.num_q;
  }

setNumQ(event) {
      event.preventDefault()
      this.setState ({num_q:event.target.value,})
      console.log(this.state.num_q)
    }

handleSubmitQ(event){
    event.preventDefault();
    this.setState({show_options:true});
    fetch('http://localhost:8080/question/'+this.props.match.params.quizname, {
    method:'POST',
    body: JSON.stringify(this.state.formDataQ),
    })
     .then(response =>{
         if(response.status >=200 && response.status <300){
           console.log("Question submitted")
         }
      });
    console.log("Question submitted")
   }

handleSubmitOption(event){
     event.preventDefault();
     // window.alert(JSON.stringify(this.state));
     this.setState({cur_q:this.state.cur_q+1})
     fetch('http://localhost:8080/option/'+this.state.formDataQ.question, {
     method:'POST',
     body: JSON.stringify({
       optname:this.state.optname,
       iscorrect:this.state.isChecked
     })})
      .then(response =>{
         if(response.status >=200 && response.status <300){
           console.log("Option submitted");
             }
        });
        if(this.state.cur_q>=this.state.num_q){
          window.alert("All options created");
          window.location = 'http://localhost:3000/Genres';
       }
  }
  // Lifecycle hook, runs after component has mounted onto the DOM structure

  render() {
    return (
      <div className="App">

        <header className="App-header">
          <h1 className="App-title">Create a new Question</h1>
          <h3 >Quiz: {this.props.match.params.quizname}</h3>
        </header>

      <div className="container">

        { !this.state.show_options &&
         <form className="form-horizontal" onSubmit={this.handleSubmitQ}>

              <div className="form-group">
                  <div className="col-sm-1 col-lg-1"></div>
                  <label className="control-label col-sm-4">Enter Question :</label>
                  <div className="col-sm-5">
                     <input type="text"
                            className="form-control"
                            placeholder="Enter your question"
                            value={this.state.question}
                            onChange={this.handleChange} required/>
                  </div>
              </div>

              <br/>

              <div className="col-sm-4 col-lg-4"></div>

              <div className="col-sm-4 col-lg-4">
                 <select className="form-control" value={this.getCurNumQ()} onChange={this.setNumQ} >
                  <option className="dropdown-item" value={3} >3</option>
                  <option className="dropdown-item" value={4} >4</option>
                  <option className="dropdown-item" value={5} >5</option>
                </select>
             </div>

          <div className="form-group">
            <div className="col-sm-4 col-lg-4">
              <button type="submit" className="btn btn-success btn-lg">Create Question</button>
              <br/>
              </div>
          </div>

        </form>
      }

      { this.state.show_options &&
       <form className="form-horizontal" onSubmit={this.handleSubmitOption}>
               <div className="form-group">
                      <div className="col-sm-1 col-lg-1"></div>
                      <label className="control-label col-sm-4">Enter Option {this.state.cur_q} :
                      </label>
                      <div className="col-sm-5">
                         <input type="text"
                                className="form-control"
                                placeholder="Enter your question"
                                value={this.state.optname}
                                onChange={this.handleChangeOption} required/>
                      </div>
                      <label class="radio-inline col-sm-6 col-lg-6">
                          <input type="radio"                         checked={this.state.isChecked}
                                 onClick={this.handleOptionChange}/>Select if Correct
                      </label>
                </div>
                <div className="form-group">
                    <div className="col-sm-4 col-lg-4">
                      <button type="submit" className="btn btn-success btn-lg">Create Option {this.state.cur_q}</button>
                      <br/>
                      </div>
                </div>
      </form>
    }


   </div>
 </div>
  );
 }
}
export default CreateQuestion;

// data-toggle="dropdown"
// aria-haspopup="true"
// aria-expanded="false"
//aria-labelledby="dropdownMenuButton"
