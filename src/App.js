import React, { useEffect, createContext, useReducer, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from "react-router-dom";
import './App.css';

import Navbar from './components/Navbar';
import Home from './components/screens/Home';
import Signin from './components/screens/Signin';
import Signup from './components/screens/Signup';
import Profile from './components/screens/Profile';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import SubsUserPost from './components/screens/SubsUserPost';
import MobNavbar from './components/screens/MobNavbar';
import CommentPage from './components/screens/CommentPage';
import Reset from './components/screens/Reset';
import Newpassword from './components/screens/Newpassword';



import { reducer, initialState } from "./reducer/userReducer"

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user })
      // history.push("/")  not use history.push becoz it will redirect to / page after refresh
    } else {
      // IF PATH iS not /reset THAN SHOW /signin otherwise /reset
      if (!history.location.pathname.startsWith('/reset')) {
        history.push("/signin")
      }
    }
  }, [])
  return (
    <Switch>
      <Route exact path="/">
        <MobNavbar />
        <SubsUserPost />
      </Route>

      <Route path="/signin">
        <Signin />
      </Route>

      <Route path="/signup">
        <Signup />
      </Route>

      <Route exact path="/profile">
        <MobNavbar />
        <Profile />
      </Route>

      <Route path="/createpost">
        <MobNavbar />
        <CreatePost />
      </Route>

      <Route path="/profile/:userid">
        <MobNavbar />
        <UserProfile />
      </Route>

      <Route path="/allpost">
        <MobNavbar />
        <Home />
      </Route>

      <Route exact path="/commentpage/:userid">
        <MobNavbar />
        <CommentPage />
      </Route>

      <Route exact path="/reset">
        <Reset />
      </Route>

      <Route path="/reset/:token">
        <Newpassword />
      </Route>
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Router>

        <Navbar />
        <Routing />

      </Router>
    </UserContext.Provider>

  );
}

export default App;
