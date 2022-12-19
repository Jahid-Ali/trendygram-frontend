import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";
import "./css/Navbar.css";

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();

  // USE MATERIALIZE MODAL FOR SEARCH STYLE SEARCH CODE
  const searchModal = useRef(null);
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);

  //load when page load
  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);

  //function to fetch user
  const fetchUsers = (query) => {
    setSearch(query);
    fetch("/search-users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        console.log(results);
        setUserDetails(results.user);
      });
  };
  // ************************************************************

  /*********************LOGOUT FUNCTION**************************/
  /*************************************************************/
  const renderList = () => {
    if (state) {
      return [
        /*************SEARCH CODE******************/
        <li key="1">
          <i data-target="modal1" className="material-icons modal-trigger">
            search
          </i>
        </li>,
        /******************************************/
        <li key="2" className="nav_profile common">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="3" className="nav_post common">
          <Link to="/createpost">Create Post</Link>
        </li>,
        <li key="4" className="nav_post common">
          <Link to="/allpost">Users</Link>
        </li>,
        <li key="5">
          <button
            className="btn #c62828 red darken-1 logout_button"
            onClick={() => {
              const val = window.confirm("Are You Sure You Want To Logout ❗");
              if (val == true) {
                localStorage.clear();
                dispatch({ type: "CLEAR" });
                history.push("/signin");
              }
            }}
            style={{ margin: 0 }}
          >
            LogOut
            <i className="material-icons right logout">exit_to_app</i>
          </button>
        </li>,
      ];
    } else {
      return [
        <li key="6">
          <Link to="/signin">Sign In</Link>
        </li>,
        <li key="7">
          <Link to="/signup">Sign Up</Link>
        </li>,
      ];
    }
  };

  return (
    <nav>
      <div className="nav-wrapper">
        <Link to={state ? "/" : "/signin"} className="brand-logo">
          Trendygram
        </Link>
        <ul id="nav-mobile" className="right">
          {/* <li>
            <Link to="/signin">Sign In</Link>
          </li>
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/createpost">Create Post</Link>
          </li> */}

          {renderList()}
        </ul>
      </div>

      {/* SEARCH CODE */}
      <div id="modal1" className="modal" ref={searchModal}>
        <div className="modal-content">
          <input
            type="text"
            placeholder="search users"
            value={search}
            onChange={(e) => fetchUsers(e.target.value)}
          />

          {/* SHOW MATCH DATA */}
          <div className="collection">
            {userDetails.map((item) => {
              return (
                <Link
                  to={
                    item._id !== state._id ? "/profile/" + item._id : "/profile"
                  }
                  // CLOSE MODAL CODE
                  onClick={() => {
                    M.Modal.getInstance(searchModal.current).close();
                    setSearch("");
                  }}
                >
                  <a href="#!" class="collection-item">
                    {item.email}
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="modal-close waves-effect waves-green btn-flat"
            onClick={() => setSearch("")}
          >
            close
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
