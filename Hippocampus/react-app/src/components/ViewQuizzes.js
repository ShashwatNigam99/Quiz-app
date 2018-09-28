import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './View.css';

class ViewQuizzes extends Component {
  constructor() {
    super();
    this.state = {
      quizzes : []
    }
    this.deleteHandler = this.deleteHandler.bind(this)
  }

  // Lifecycle hook, runs after component has mounted onto the DOM structure
  componentDidMount() {
  //  console.log(this.props)
  //  console.log('lol'+this.props.match.params.genrename)
    const request = new Request('http://127.0.0.1:8080/quizzes/'+this.props.match.params.genrename);
    console.log('request--'+'http://127.0.0.1:8080/quizzes/'+this.props.match.params.genrename)
    fetch(request)
      .then(response => response.json())
        .then(quizzes => this.setState({quizzes:quizzes}));
  }

  deleteHandler(event){
    fetch('http://127.0.0.1:8080/genre/'+this.props.match.params.genrename,{
      method:'DELETE'
    })
    .then(response =>{
      if(response.status>=200 && response.status<300)
         window.alert('Genre '+this.props.match.params.genrename+' was deleted.')
    });
    }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Quizzes under genre {this.props.match.params.genrename}</h1>
        </header>
        <br/><br/>
       <div className="container">

         {sessionStorage.getItem("isLoggedIn")=="true" &&
          sessionStorage.getItem("userIsAdmin")=="true" &&
         <div className="col-sm-4 col-lg-4">
         <Link to={'/CreateQuiz/'+this.props.match.params.genrename}><div className="glyphicon glyphicon-plus"><h2><strong> Create a new Quiz</strong></h2></div></Link>
         </div>
       }
       {sessionStorage.getItem("isLoggedIn")=="true" &&
        sessionStorage.getItem("userIsAdmin")=="true" &&
         <div className="col-sm-4 col-lg-4">
         <Link to={'/Genres/'} onClick={this.deleteHandler}><div className="glyphicon glyphicon-minus"><h2><strong>Delete this Genre</strong></h2></div></Link>
         </div>
       }
       {
        sessionStorage.getItem("userIsAdmin")=="true" &&
         <div className="col-sm-4 col-lg-4">
         <Link to={'/Leaderboard/'+this.props.match.params.genrename}><div className="glyphicon glyphicon-asterisk"><h2><strong>See genre Leaderboard</strong></h2></div></Link>
         </div>
       }
       {sessionStorage.getItem("isLoggedIn")=="true" &&
       sessionStorage.getItem("userIsAdmin")=="false" &&
       <div className="col-sm-12 col-lg-12">
       <Link to={'/Leaderboard/'+this.props.match.params.genrename}><div className="glyphicon glyphicon-asterisk"><h2><strong>See genre Leaderboard</strong></h2></div></Link>
       </div>
       }


         <div className="col-sm-12 col-lg-12"><br/><br/></div>
         {this.state.quizzes.length>0 && this.state.quizzes.map(function(item, key){
              return(
                <div className="col-sm-6 col-lg-6">
                 <div>
                   <Link to={'/Quiz/'+item.quizname} className="btn btn-primary btn-lg btn-block"><h4><strong>{item.quizname}</strong></h4></Link>
                 </div>
               <br/>
             </div>
               )
             })}
       </div>
    </div>
    );
  }
}

export default ViewQuizzes;
