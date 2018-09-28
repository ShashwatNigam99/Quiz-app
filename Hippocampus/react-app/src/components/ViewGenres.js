import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './View.css';

class ViewGenres extends Component {
  constructor() {
    super();
    this.state = {
      genres: []
    }
  }

  // Lifecycle hook, runs after component has mounted onto the DOM structure
  componentDidMount() {
    const request = new Request('http://127.0.0.1:8080/genres/');
    fetch(request)
      .then(response => response.json())
        .then(genres => this.setState({genres: genres}));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Quiz Genres</h1>
        </header>
        {/* <br/>
        <Link to={'/CreateGenre/'}><div class="glyphicon glyphicon-plus"><h2><strong> Create a new Genre</strong></h2></div></Link>
        <br/><br/> */}

        <div className="container">
          {sessionStorage.getItem("isLoggedIn")=="true" &&
           sessionStorage.getItem("userIsAdmin")=="true" &&
          <div className="col-sm-12 col-lg-12">
          <Link to={'/CreateGenre/'}><div class="glyphicon glyphicon-plus"><h2><strong> Create a new Genre</strong></h2></div></Link>
          </div>
        }
          <div className="col-sm-12 col-lg-12"><br/><br/></div>
          {this.state.genres.length>0 && this.state.genres.map(function(item, key){
               return(
                 <div className="col-sm-4 col-lg-4">
                  <div>
                    <Link to={'/Quizzes/'+item.genrename} className="btn btn-primary btn-lg btn-block"><h4><strong>{item.genrename}</strong></h4></Link>
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
export default ViewGenres;
