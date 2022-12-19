import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import "../css/Profile.css";

const Profile = () => {
  const [mypic, setMypic] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");

  // console.log("STATE :", state.name);

  // run when page load
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("MY POST (PROFILE)", result);
        setMypic(result.mypost);
      });
  }, []);

  // UPLOAD IMAGE IN COLUDINARY
  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "trendygram");
      data.append("cloud_name", "imagecloud007");
      fetch("https://api.cloudinary.com/v1_1/imagecloud007/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
              //window.location.reload()
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);

  // we are getting pic file to upload
  const updatePhoto = (file) => {
    setImage(file);
  };

  return (
    <div className="main">
      <div className="root">
        {/* IMAGE DIV */}
        <div>
          <img
            src={state ? state.pic : "loading"}
            alt="profile pic"
            className="profileimg"
          />
        </div>
        {/* UPDATE BUTTON DIV */}
        <div className="updateButton">
          {/* FOR UPDATE IMAGE */}
          <div className="file-field">
            <span>Update pic</span>
            <input
              type="file"
              onChange={(e) => updatePhoto(e.target.files[0])}
            />
          </div>
        </div>
        {/* INFO PART */}
        <div className="info">
          <h4>{state ? state.name : "loading"}</h4>
          <h6 style={{ color: "blue" }}>{state ? state.email : "loading"}</h6>
          <div className="info-1">
            <h6>{mypic.length} Post</h6>
            <h6>{state ? state.followers.length : "0"} Follower</h6>
            <h6>{state ? state.following.length : "0"} following</h6>
          </div>
        </div>
      </div>

      {/* TO SHOW LOADING SCREEN */}
      {mypic[0] ? (
        <div className="gallery">
          {mypic.map((item) => {
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
      ) : (
        <div className="Profile_container">
          <h2 className="loader_profile"></h2>
        </div>
      )}
    </div>
  );
};

export default Profile;
