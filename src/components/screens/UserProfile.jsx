import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import "../css/Userprofile.css";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const [userProfile, setuserProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();

  // TO SHOW FOLLOW OR UNFOLLOW
  const [showFollow, setShowFollow] = useState(
    state ? !state.following.includes(userid) : true
  );

  // console.log("STATE :", state.name);

  // run when page load
  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log("OTHER USER (PROFILE)", result);
        // console.log("OTHER USER DETAILS (PROFILE)", result.user);
        // console.log("OTHER USER POST (PROFILE)", result.posts[0].comments);
        setuserProfile(result);
      });
  }, [userid]);

  // FOR FOLLOW
  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });

        // Save new data in local storage
        localStorage.setItem("user", JSON.stringify(data));

        // We are spreading previous state and overwritting user field by new data
        setuserProfile((previousState) => {
          return {
            ...previousState,
            user: {
              ...previousState.user,
              followers: [...previousState.user.followers, data._id],
            },
          };
        });
        setShowFollow(false);
      });
  };

  // FOR UN-FOLLOW
  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });

        // Save new data in local storage
        localStorage.setItem("user", JSON.stringify(data));

        // We are spreading previous state and overwritting user field by new data

        setuserProfile((previousState) => {
          const newFollowers = previousState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            ...previousState,
            user: {
              ...previousState.user,
              followers: newFollowers,
            },
          };
        });
        setShowFollow(true);
      });
  };

  return (
    <>
      {/* TERNARY OPERATOR USE BECOZE IT TAKE TIME TO LOAD SO IT SO LOADING */}
      {userProfile ? (
        <div className="main">
          <div className="root">
            <div>
              <img
                src={userProfile.user.pic}
                alt="profile pic"
                className="profileimg"
              />
            </div>
            <div className="info">
              <h4>{userProfile.user.name}</h4>
              <div className="info-1">
                {/* SHOW POST OF OTHER USER */}
                <h6>{userProfile.posts.length} Post</h6>
                <h6>{userProfile.user.followers.length} Follower</h6>
                <h6>{userProfile.user.following.length} following</h6>
              </div>

              {/* WHEN SHOW FOLLOW or UNFOLLOW */}
              {showFollow ? (
                /* FOLLOW BUTTON */
                <button
                  className="btn waves-effect waves-light"
                  onClick={() => followUser()}
                >
                  follow
                  <i className="material-icons right">add</i>
                </button>
              ) : (
                /* UN-FOLLOW BUTTON */
                <button
                  className="btn waves-effect waves-light"
                  onClick={() => unfollowUser()}
                >
                  Unfollow
                  <i className="material-icons right">remove</i>
                </button>
              )}
            </div>
          </div>

          <div className="gallery">
            {userProfile.posts.map((item) => {
              return (
                <img
                  key={item._id}
                  className="item"
                  src={item.photo}
                  alt={item.title}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="userProfile_container">
          <h2 className="userProfile_loading">LOADING...</h2>
        </div>
      )}
    </>
  );
};

export default UserProfile;
