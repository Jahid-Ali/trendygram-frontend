import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const Signup = () => {
  const history = useHistory();
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);

  //Run When PAGE LOAD
  useEffect(() => {
    // If url exist than call uplaodFields
    if (url) {
      uploadFields();
    }
  }, [url]);

  
  // USESTATE
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });


  // EVENT HANDLER
  const inputEvent = (e) => {
    const { name, value } = e.target;

    setUser({
      ...user,
      [name]: value,
    });
  };


  // UPLOAD IMAGE IN COLUDINARY
  const uploadPic = () => {
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

  // Send data in Back end
  const uploadFields = () => {
    const { name, email, password } = user;

    // CHECK VALID EMAIL
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      M.toast({
        html: "Invalid Email!",
        classes: "#dd2c00 deep-orange accent-4",
      });
      return;
    }

    fetch("/signup", {
      method: "post",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#e53935 red darken-1" });
        } else {
          M.toast({ html: data.message, classes: "#00c853 green accent-4" });
          history.push("/signin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const PostData = () => {
    if (image) {
      uploadPic();
    } else {
      uploadFields();
    }
  };

  return (
    <div className="mycard">
      <div className="card auth-card input-field card-signup">
      <h2 className="name">Trendygram</h2>

        <input
          type="text"
          name="name"
          value={user.name}
          onChange={inputEvent}
          placeholder="name"
          autoComplete="off"
        />
        <input
          type="text"
          name="email"
          value={user.email}
          onChange={inputEvent}
          placeholder="email"
          autoComplete="off"
        />
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={inputEvent}
          placeholder="password"
        />

        {/* FOR USER IMAGE */}
        <div className="file-field input-field">
          <div
            className="btn"
            style={{ height: "2.5rem", lineHeight: "2.5rem" }}
          >
            <span>upload Pic</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>

          <div className="file-path-wrapper" style={{ marginBottom: "20px" }}>
            <input className="file-path validate" type="text" />
          </div>
        </div>

        <button
          className="btn waves-effect waves-light"
          onClick={() => PostData()}
        >
          sign-up
          <i className="material-icons right">send</i>
        </button>

        <h6>
          <Link to="/signin" className="signup">
            Already have an account ?
          </Link>
        </h6>
      </div>
    </div>
  );
};

export default Signup;
