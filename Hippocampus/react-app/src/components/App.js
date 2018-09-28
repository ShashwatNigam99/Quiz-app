import React, { Component } from 'react';
import NewUser from './NewUser';
import ViewGenres from './ViewGenres';
import ViewQuizzes from './ViewQuizzes';
import ViewQuiz from './ViewQuiz';
import DeleteUser from './DeleteUser';
import ViewUsers from './ViewUsers';
import CreateGenre from './CreateGenre';
import CreateQuiz from './CreateQuiz';
import CreateQuestion from './CreateQuestion';
import LeaderBoard from './LeaderBoard';
import OverallLeaderBoard from './OverallLeaderBoard';
import Performance from './Performance'
import Login from './Login';
import Home from './Home';
import './App.css'

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class App extends Component {

  constructor() {
    super();
    this.logOutHandler = this.logOutHandler.bind(this);
  }


logOutHandler(event){
  //window.alert("User "+ sessionStorage.getItem("userNameLoggedIn") +" logged out. Log in to continue.");
  sessionStorage.setItem("isLoggedIn","false");
  sessionStorage.setItem("userIDLoggedIn","");
  sessionStorage.setItem("userIsAdmin","false");
  sessionStorage.setItem("userNameLoggedIn","");
  window.location = 'http://localhost:3000/Login';
}

  render() {
    return (
      <div>
        <Router>
          <div>
              <nav className="navbar navbar-inverse">
                <div className="container-fluid navstyle">
                   <div className="navbar-header">
                      <Link className="navbar-brand" to={'/'}>Hippocampus</Link>
                   </div>
                <ul className="nav navbar-nav">

                   {sessionStorage.getItem("isLoggedIn")==null &&
                   <li><Link to={'/Login'}>Login</Link></li>
                   }
                   {sessionStorage.getItem("isLoggedIn")=="false" &&
                     <li><Link to={'/Login'}>Login</Link></li>
                   }
                   {sessionStorage.getItem("isLoggedIn")==null &&
                     <li><Link to={'/Register'}>Register</Link></li>
                   }
                   {sessionStorage.getItem("isLoggedIn")=="false" &&
                     <li><Link to={'/Register'}>Register</Link></li>
                   }
                  { sessionStorage.getItem('isLoggedIn')=="true" &&
                  <li><Link to={'/Genres'}>Genres</Link></li>
                  }

                  { sessionStorage.getItem("isLoggedIn")=="true" &&
                    sessionStorage.getItem("userIsAdmin")=="true" &&
                    <li><Link to={'/ViewUsers'}>View Users</Link></li>
                  }
                  { sessionStorage.getItem("isLoggedIn")=="true" &&
                    sessionStorage.getItem("userIsAdmin")=="true" &&
                    <li><Link to={'/DeleteUser'}>Delete User</Link></li>
                  }
                  { sessionStorage.getItem("isLoggedIn")=="true" &&
                    <li><Link to={'/Leaderboard'}>Leaderboard</Link></li>
                  }

                  { sessionStorage.getItem("isLoggedIn")=="true" &&
                    <li><Link to={'/Performance/'+sessionStorage.getItem("userIDLoggedIn")}>Performance</Link></li>
                  }

                  {sessionStorage.getItem("isLoggedIn")=="true" &&
                   <li><Link to={'/Login'} onClick={this.logOutHandler} >Logout</Link></li>
                  }
                </ul>

              </div>
            </nav>
            <Switch>
                 <Route exact path='/' component={Home} />
                 <Route exact path='/Register' component={NewUser} />
                 <Route exact path='/Login' component={Login} />
                 <Route exact path='/Genres' component={ViewGenres} />
                 <Route exact path='/Quizzes/:genrename' component={ViewQuizzes} />
                 <Route exact path='/Quiz/:quizname' component={ViewQuiz}/>
                 <Route exact path='/ViewUsers' component={ViewUsers} />
                 <Route exact path='/Leaderboard' component={OverallLeaderBoard}/>
                 <Route exact path='/Leaderboard/:genrename' component={LeaderBoard}/>
                 <Route exact path='/Performance/:userid' component={Performance}/>

                       {/* admin section */}
                 <Route exact path='/DeleteUser' component={DeleteUser} />
                 <Route exact path='/CreateGenre' component={CreateGenre} />
                 <Route exact path='/CreateQuiz/:genrename' component={CreateQuiz} />
                 <Route exact path='/CreateQuestion/:quizname' component={CreateQuestion } />

            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
