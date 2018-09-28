import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './View.css';

class ViewQuiz extends Component {
  constructor() {
    super();
    this.state = {
      questions : [],
      score: 0,
      checked_options : new Array(200).fill(-1),
      attempted_questions : new Array(100).fill(false),
      num_q : 0
    }
    this.deleteHandler = this.deleteHandler.bind(this)
  }

handleSubmit = (qid,options) => {
  console.log("handle submit")
  console.log("questions left"+this.state.num_q)

  if(this.state.attempted_questions[qid]!=true){
  var num_options = options.length
  var x=1
  for(var i=0;i<num_options;i++){
    console.log("for i="+i+" ")
    console.log(options[i].iscorrect)
    console.log(this.state.checked_options[options[i].optid])
    if(options[i].iscorrect==true && this.state.checked_options[options[i].optid]==1 || options[i].iscorrect==false && this.state.checked_options[options[i].optid]==-1 )
      continue;
    else{
      console.log("BREAK i="+i+" ")
      x=0;
      break;
    }
  }
  console.log("x="+x)
  if(x==1){
  this.state.score = this.state.score+1
  console.log("Score " + this.state.score)
  }
  const cp = this.state.attempted_questions.slice() //copy the array
  cp[qid] = true //execute the manipulations
  this.setState({attempted_questions: cp}) //set the new state
  this.state.num_q=this.state.num_q-1
  if(this.state.num_q==0){
     fetch('http://localhost:8080/score/'+
           this.props.match.params.quizname+'/'+
            sessionStorage.getItem("userIDLoggedIn")+'/'+
            String(this.state.score), {
      method: 'POST',
    })
       .then(response => {
         if(response.status >= 200 && response.status < 300)
           window.alert("Quiz over, score : "+this.state.score);
       });
       window.location = 'http://localhost:3000/Genres';
    }
  }
}

componentDidMount() {
    const request = new Request('http://127.0.0.1:8080/quiz/'+this.props.match.params.quizname);
    fetch(request)
      .then(response => response.json())
        .then(questions => this.setState( { questions:questions,
                                            num_q:questions.length } ));
  this.setState({
        questions : [],
        score: 0,
        checked_options : new Array(200).fill(-1),
        attempted_questions : new Array(100).fill(false),
        num_q : 0
      })
  }

deleteHandler(event){
    fetch('http://127.0.0.1:8080/quiz/'+this.props.match.params.quizname,{
      method:'DELETE'
    })
    .then(response =>{
      if(response.status>=200 && response.status<300){
         window.alert('Quiz '+this.props.match.params.quizname+' was deleted.')
         window.location = 'http://localhost:3000/Genres';
       }
    });
    }

// disable on sunbmit accoriding to id
render() {
  console.log(this.handleOptionChange)
   return (
      <div className="App">
         <header className="App-header">
           <h1 className="App-title">Quiz : {this.props.match.params.quizname}</h1>
         </header>
         <br/><br/>
         <div className="container">
           {sessionStorage.getItem("isLoggedIn")=="true" &&
            sessionStorage.getItem("userIsAdmin")=="true" &&
           <div className="col-sm-6 col-lg-6">
           <Link to={'/CreateQuestion/'+this.props.match.params.quizname}><div class="glyphicon glyphicon-plus"><h2><strong>Create a new Question</strong></h2></div></Link>
           </div>
         }
         {sessionStorage.getItem("isLoggedIn")=="true" &&
          sessionStorage.getItem("userIsAdmin")=="true" &&
           <div className="col-sm-6 col-lg-6">
           <Link to={'/Genres/'} onClick={this.deleteHandler}><div class="glyphicon glyphicon-minus"><h2><strong>Delete this Quiz</strong></h2></div></Link>
           </div>
         }
          {this.state.questions.map((question,key) =>
           {
              return(
              <div>
                  <h2>{question.question}</h2>
                  <div>
                    { question.Options.map((opt,k) =>
                      {
                        return (
                              <div>
                                <label>{"   "+opt.optname+"  "}
                                 <input
                                    id = {opt.optid}
                                    name ={opt.qid}
                                    type ="checkbox"
                                    value ={opt.iscorrect}
                                    checked={this.state.checked_options[opt.optid] == 1}
                                    onChange = {() => {
                                      const cp = this.state.checked_options.slice() //copy the array
                                      cp[opt.optid] = (-1*cp[opt.optid]) //execute the manipulations
                                      this.setState({checked_options: cp}) //set the new state
                                      // this.state.checked_options = cp
                                      console.log(this.state.checked_options)
                                      console.log(this.state.checked_options[opt.optid])
                                    }}
                                  />
                                </label>
                                <br/>
                              </div>
                              )
                       })}
                <button className="btn btn-primary"
                        id={question.qid}
                        type="submit"
                        disabled={this.state.attempted_questions[question.qid]}
                        onClick={() => this.handleSubmit(question.qid,question.Options)}>
                        Submit</button>
                <hr/>
              </div>
          </div>
              )
            })}
      </div>
   </div>
  );
 }
}

export default ViewQuiz;
