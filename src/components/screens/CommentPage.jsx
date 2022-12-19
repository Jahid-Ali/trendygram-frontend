import React, { useState, useEffect } from "react";
import "../css/Home.css";
import { useParams } from "react-router-dom";

const CommentPage = () => {
  const [data, setData] = useState([]);
  const { userid } = useParams();

  // run when page load
  useEffect(() => {
    fetch(`/comm/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("ONLY POSTS", result);
        console.log("ONLY POSTS", result.posts);
        setData(result.posts);
      });
  }, []);

  // FOR COMMENT
  const makeComment = (text, id) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },

      body: JSON.stringify({
        postId: id,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("COMMENT : ", result);
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
        // window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {/*TO SHOW LOADING SCREEN */}
      {data[0] ? (
        <div className="home">
          {data.map((item) => {
            //   THIS IS FOR SHOW ONLY ONE POST COMMENT
            if (item._id === userid) {
              return (
                <div className="card home-card" key={item._id}>
                  <div className="card-content">
                    {/* FOR COMMENT */}
                    {item.comments.map((record) => {
                      return (
                        <h6 key={record._id}>
                          <span className="who_comment">
                            {record.postedBy.name}
                            {" -"}
                          </span>
                          {record.text}
                        </h6>
                      );
                    })}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        // console.log(e.target[0]);
                        makeComment(e.target[0].value, item._id);
                      }}
                    >
                      <input type="text" placeholder="add a comment" />
                    </form>
                  </div>
                </div>
              );
            }
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

export default CommentPage;
