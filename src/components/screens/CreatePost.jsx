import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

const CreatePost = () => {
  const history = useHistory();
  const [url, setUrl] = useState("");

  // USE USEEFFECT
  useEffect(() => {
    // network request
    if (url) {
      const { title, body } = post;
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json ",
          "Authorization": "Bearer " + localStorage.getItem("jwt"),
        },

        body: JSON.stringify({
          title: title,
          body: body,
          pic: url,
        }),
      })
        .then((res) => res.json())

        .then((data) => {
          console.log(data);

          if (data.error) {
            M.toast({ html: data.error, classes: "#e53935 red darken-1" });
          } else {
            M.toast({
              html: "Posted successfully",
              classes: "#00c853 green accent-4",
            });
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url]);


  // USE USESTATE
  const [post, setPost] = useState({
    title: "",
    body: "",
  });


  // EVENT HANDLER
  const inputEvent = (e) => {
    const { name, value } = e.target;

    setPost({
      ...post,
      [name]: value,
    });
  };


  // UPLOAD IMAGE IN COLUDINARY
  const [image, setImage] = useState("");
  const uploadImage = () => {
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
        console.log("CREATE POST DATA >>>>>>>", data);
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="mycard">
      <div className="card auth-card">
        <h3 style={{ fontFamily: "Grand Hotel" }}>Be happy 😄</h3>

        <input
          type="text"
          name="title"
          value={post.title}
          onChange={inputEvent}
          placeholder="Title"
        />
        <input
          type="text"
          name="body"
          value={post.body}
          onChange={inputEvent}
          placeholder="Content"
        />

        <div className="file-field input-field">
          <div
            className="btn"
            style={{ height: "2.5rem", lineHeight: "2.5rem" }}
          >
            <span>upload image</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>

          <div className="file-path-wrapper" style={{ marginBottom: "20px" }}>
            <input className="file-path validate" type="text" />
          </div>
        </div>

        <button
          className="btn waves-effect waves-light"
          style={{ marginTop: "20px" }}
          onClick={() => uploadImage()}
        >
          submit post
          <i className="material-icons right">send</i>
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
