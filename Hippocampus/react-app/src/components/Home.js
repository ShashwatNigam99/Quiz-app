import React, { Component } from 'react';
import './Home.css'

class Home extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="Home-title">Welcome to Hippocampus</h1>
        </header>
        {sessionStorage.getItem("isLoggedIn")==null &&
        <h1 className="header">What are you waiting for ? Log In / Register and get started!</h1>
        }
        {sessionStorage.getItem("isLoggedIn")=="false" &&
        <h1 className="header">What are you waiting for ? Log In / Register and get started!</h1>
        }
       { sessionStorage.getItem('isLoggedIn')=="true" &&
        <h1 className="header">Hi {sessionStorage.getItem("userNameLoggedIn")}!
            Have fun quizzing ! Explore Genres you like by clicking on the link above.</h1>
       }
      { sessionStorage.getItem('isLoggedIn')=="true" &&
        <h1 className="header">View your performance in quizzes and see where you stand compared to your peers</h1>
       }

      </div>
    );
  }
}

export default Home;
