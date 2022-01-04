import { useContext, useState } from "react";
import { UserContext } from "../components/context";
import Modal from "react-modal";
import { FaCog } from "react-icons/fa";

const BASE_URL = "http://localhost:8080/";
const nameRegex = /^[a-z ,.'-]+$/i;
const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function AccountSettings() {
  const [user, setUser] = useContext(UserContext);
  const [userInput, setUserInput] = useState(() => ({ ...user }));
  const [uploadedImg, setUploadedImg] = useState(null);
  const [tempImg, setTempImg] = useState();
  const [error, setError] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleSubmit = (e) => {
    fetch(`${BASE_URL}api/users/${user._id}`, {
      method: "POST",
      body: JSON.stringify({
        ...userInput,
        image: user.image,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        localStorage.setItem("User", JSON.stringify(data));
      });

    if (uploadedImg) {
      let imgData = new FormData();
      imgData.append("image", uploadedImg);

      fetch(`${BASE_URL}api/images`, {
        method: "POST",
        body: imgData,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch(`${BASE_URL}api/users/${user._id}`, {
            method: "POST",
            body: JSON.stringify({
              ...userInput,
              image: `${BASE_URL}images/${data.filename}`,
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          })
            .then((res) => res.json())
            .then((data) => {
              setUser(data);
              localStorage.setItem("User", JSON.stringify(data));
            });
        })
        .catch((err) => console.log(err));
    }
    // SetUser to new Data Above
    setIsModal(false);
    e.preventDefault();
  };

  const fileSelectedHandler = (e) => {
    if (
      e.target.files[0].name.includes(".jpeg") ||
      e.target.files[0].name.includes(".jpg") ||
      e.target.files[0].name.includes(".png")
    ) {
      setError(false);
      setUploadedImg(e.target.files[0]);
      setTempImg({ file: URL.createObjectURL(e.target.files[0]) });
    } else {
      setError(true);
    }
    e.preventDefault();
  };

  const removeImage = () => {
    setUploadedImg(null);
    setTempImg("");
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#ffffff",
      padding: 0,
      borderRadius: 10,
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      zIndex: 1000,
    },
  };

  return (
    <>
      <div
        onClick={() => {
          setIsModal(true);
        }}
        className="btn transparent-btn"
      >
        <div className="row">
          <img
            className={`sm-profile-img sm-${user.theme}-border profile-setting`}
            src={user.image}
            alt="user-profile"
          />
          <FaCog className="sm-profile-img" />
        </div>
      </div>
      <Modal
        closeTimeoutMS={300}
        isOpen={isModal}
        ariaHideApp={false}
        onRequestClose={() => setIsModal(false)}
        style={customStyles}
      >
        <form
          className="form"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <h3 className="bottom-sm-margin">Edit User</h3>
          <div className="form-split">
            <div className="form-section">
              {tempImg ? (
                <>
                  <img
                    className={`profile-img ${userInput.theme}-border`}
                    src={tempImg.file}
                    alt="img"
                  />
                  <div className="error" onClick={() => removeImage()}>
                    Remove
                  </div>
                </>
              ) : (
                <img
                  className={`profile-img ${userInput.theme}-border bottom-sm-margin`}
                  src={user.image}
                  alt="user_image"
                />
              )}
              {error ? (
                <div className="error">Invalid Image (.jpeg, .jpg, .png)</div>
              ) : null}
              <label className="btn teal-outline-btn">
                <input
                  type="file"
                  name="image"
                  onChange={fileSelectedHandler}
                />
                Upload
              </label>
              <br />
              <div className="form-split">
                <input
                  className={`input ${nameError ? "input-error" : null}`}
                  type="text"
                  placeholder="First Name*"
                  value={userInput.first_name}
                  name="first_name"
                  onChange={(e) => {
                    if (nameRegex.test(e.target.value)) {
                      setNameError(false);
                    } else {
                      setNameError(true);
                    }
                    setUserInput((prev) => ({
                      ...prev,
                      first_name: e.target.value,
                    }));
                  }}
                />
                <input
                  className={`input left-sm-margin ${
                    nameError ? "input-error" : null
                  }`}
                  type="text"
                  placeholder="Last Name*"
                  value={userInput.last_name}
                  name="last_name"
                  onChange={(e) => {
                    if (nameRegex.test(e.target.value)) {
                      setNameError(false);
                    } else {
                      setNameError(true);
                    }
                    setUserInput((prev) => ({
                      ...prev,
                      last_name: e.target.value,
                    }));
                  }}
                />
              </div>
              {nameError ? (
                <div className="error">Invalid Name</div>
              ) : (
                <div>
                  <br />
                </div>
              )}

              <input
                className={emailError ? "input-error" : null}
                type="text"
                placeholder="Email*"
                value={userInput.email}
                name="email"
                onChange={(e) => {
                  if (emailRegex.test(e.target.value)) {
                    setEmailError(false);
                  } else {
                    setEmailError(true);
                  }
                  setUserInput((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }));
                }}
              />
              {emailError ? <div className="error">Invalid Email</div> : null}
              <label className="bold top-sm-margin">
                Color Theme:
                <select
                  value={userInput.theme}
                  name="theme"
                  onChange={(e) =>
                    setUserInput((prev) => ({
                      ...prev,
                      theme: e.target.value,
                    }))
                  }
                >
                  <option value="blue">Blue</option>
                  <option value="pink">Pink</option>
                  <option value="orange">Orange</option>
                  <option value="gold">Gold</option>
                </select>
              </label>
              <br />
              <input
                className="btn green-btn sm-width"
                type="submit"
                value="Submit"
              />
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
  //
}
