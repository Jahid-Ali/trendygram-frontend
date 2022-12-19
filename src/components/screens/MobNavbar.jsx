import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import M from "materialize-css";

import "../css/Navbar.css";

const MobNavbar = () => {
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

  return (
    <nav className="mob_nav">
      <div className="mob_nav-wrapper">
        {/* FOR SHORT SCREEN */}

        <ul className="mobile-nav">
          <li key="1">
            <Link to="/">
              <i className="material-icons mob_home comm">home</i>
            </Link>
          </li>
          <li key="2">
            <Link to="/profile">
              <i className="material-icons account_circle comm">account_box</i>
            </Link>
          </li>
          <li key="3" className="search">
            <i
              data-target="modal1"
              className="material-icons search1 modal-trigger"
            >
              search
            </i>
          </li>
          <li key="4">
            <Link to="/createpost">
              <i className="material-icons add_photo comm">
                add_photo_alternate
              </i>
            </Link>
          </li>
          <li key="5">
            <Link to="/allpost">
              <i className="material-icons following_post comm">auto_awesome</i>
            </Link>
          </li>
          <li
            key="6"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/signin");
            }}
            style={{ margin: 0 }}
          >
            <i className="material-icons mob_logout comm">exit_to_app</i>
          </li>
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

export default MobNavbar;
