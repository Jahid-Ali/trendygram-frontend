import React, { useState, useEffect, useContext } from "react";

import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import "../css/Home.css";

const SubsUserPost = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  // run when page load
  useEffect(() => {
    fetch("/getsubpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("ALL POST (HOME)", result);
        setData(result.posts);
      });
  }, []);

  // FOR LIKE
  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("LIKE : ", result);
        const newData = data.map((item) => {
          // console.log(item._id);
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // FOR UNLIKE
  const unLikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //   console.log("UNLIKE : ", result)
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };


  // FOE DELETE POST
  const deletePost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("DELETE : ", result);
        // WE USE FILTER BCOZ FILTER OUT DELETING ITEM
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };

  return (
    <>
      {/*TO SHOW LOADING SCREEN */}
      {data[0] ? (
        <div className="home">
          {data.map((item) => {
            return (
              <div className="card home-card" key={item._id}>
                <h5 className="posted_name">
                  {/* TO FROM OTHER PROFILE */}
                  <Link
                    to={
                      item.postedBy._id !== state._id
                        ? "/profile/" + item.postedBy._id
                        : "/profile"
                    }
                  >
                    {item.postedBy.name}
                  </Link>

                  {/* {console.log("ITEM" , item.comments[0].postedBy._id)} */}
                  {/* TO MATCH LOGIN AND POST USER ID TO SHOW DELETE ICON */}
                  {item.postedBy._id === state._id && (
                    <i
                      className="material-icons"
                      style={{
                        float: "right",
                      }}
                      onClick={() => deletePost(item._id)}
                    >
                      delete
                    </i>
                  )}
                </h5>
                <div className="card-image">
                  <img src={item.photo} alt="pic" />
                </div>
                <div className="card-content">
                  <i className="material-icons" style={{ color: "red" }}>
                    favorite
                  </i>

                  {/* TO PREVENT FROM AGAIN AND AGAIN LIKE */}
                  {item.likes.includes(state._id) ? (
                    <i
                      className="material-icons"
                      onClick={() => {
                        unLikePost(item._id);
                      }}
                    >
                      thumb_down
                    </i>
                  ) : (
                    <i
                      className="material-icons"
                      onClick={() => {
                        likePost(item._id);
                      }}
                    >
                      thumb_up
                    </i>
                  )}

                  <h6>{item.likes.length}</h6>
                  <h6>{item.title}</h6>
                  <p>{item.body}</p>

                  {/* FOR COMMENT */}
                  <div className="commentpage">
                    {item.comments.length > 1 ? (
                      <div className="commentpage1">
                        <span>{item.comments.length}</span>
                        <Link
                          to={
                            item.comments
                              ? "/commentpage/" + item._id
                              : "/commentpage"
                          }
                        >
                          comments
                        </Link>
                        <i className="material-icons comment-icon">comment</i>
                      </div>
                    ) : (
                      <div className="commentpage1">
                        <span>{item.comments.length}</span>
                        <Link
                          to={
                            item.comments
                              ? "/commentpage/" + item._id
                              : "/commentpage"
                          }
                        >
                          comment
                        </Link>
                        <i className="material-icons comment-icon">comment</i>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // WHEN NO POST AVAILABE SHOW THIS
        <div className="Home_container">
          <h2 className="loader"></h2>
        </div>
      )}
    </>
  );
};

export default SubsUserPost;
