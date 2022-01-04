import { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GrEdit, GrTrash } from "react-icons/gr";
import Modal from "react-modal";
import { UserContext } from "./context";

const BASE_URL = "http://localhost:8080/";
const nameRegex = /^[a-z ,.'-]+$/i;

export default function EditKid({ kidData, graphUpdate }) {
  const [kid, setKid] = useState(kidData);
  const [user] = useContext(UserContext);
  const [editable, setEditable] = useState(false);
  const [userInput, setUserInput] = useState(kidData);
  const [uploadedImg, setUploadedImg] = useState(null);
  const [tempImg, setTempImg] = useState();
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(false);
  const [birthDate, setBirthDate] = useState(() => {
    let data = { ...kidData };
    let birthdayArr = data.birth_date.split("T");
    let birthday = birthdayArr[0].split("-");
    let updateDay = parseInt(birthday[2] - 1)
      .toString()
      .padStart(2, "0");
    return `${birthday[1]}/${updateDay}/${birthday[0]}`;
  });
  const [currentDate] = useState(() => {
    let currentFullDate = new Date();
    let currentMonth = (currentFullDate.getMonth() + 1)
      .toString()
      .padStart(2, "0");
    let currentDay = currentFullDate.getDate().toString().padStart(2, "0");
    return `${currentMonth}/${currentDay}`;
  });
  const [birthday, setBirthday] = useState();

  const [age, setAge] = useState(() => {
    let data = { ...kidData };
    let birthdate = new Date(data.birth_date);
    let difference = Date.now() - birthdate.getTime();
    let ageDiff = new Date(difference);
    let kidAge = Math.abs(ageDiff.getUTCFullYear() - 1970);
    return kidAge;
  });

  const [dateError, setDateError] = useState(false);
  const [nameError, setNameError] = useState(false);

  useEffect(() => {
    setBirthday(() => {
      let data = { ...kid };
      let birthdayArr = data.birth_date.split("T");
      let birthday = birthdayArr[0].split("-");
      let updateDay = parseInt(birthday[2] - 1)
        .toString()
        .padStart(2, "0");
      return `${birthday[1]}/${updateDay}`;
    });
    setBirthDate(() => {
      let data = { ...kid };
      let birthdayArr = data.birth_date.split("T");
      let birthday = birthdayArr[0].split("-");
      let updateDay = parseInt(birthday[2] - 1)
        .toString()
        .padStart(2, "0");
      return `${birthday[1]}/${updateDay}/${birthday[0]}`;
    });
    setAge(() => {
      let data = { ...kid };
      let birthdate = new Date(data.birth_date);
      let difference = Date.now() - birthdate.getTime();
      let ageDiff = new Date(difference);
      let kidAge = Math.abs(ageDiff.getUTCFullYear() - 1970);
      return kidAge;
    });
  }, [kid]);

  useEffect(() => {
    if (uploadedImg) {
      let imgData = new FormData();
      imgData.append("image", uploadedImg);

      fetch(`${BASE_URL}api/images`, {
        method: "POST",
        body: imgData,
      })
        .then((res) => res.json())
        .then((data) => {
          setUserInput((prev) => ({
            ...prev,
            image: `${BASE_URL}images/${data.filename}`,
          }));
        })
        .catch((err) => console.log(err));
    }
  }, [uploadedImg]);

  const handleSubmit = (e) => {
    if (
      nameError ||
      dateError ||
      !userInput.first_name ||
      !userInput.last_name
    ) {
      if (!userInput.first_name || !userInput.last_name) {
        setNameError(true);
      }
    } else {
      setNameError(false);
      fetch(`${BASE_URL}api/kids/${kid._id}`, {
        method: "POST",
        body: JSON.stringify({
          ...userInput,
          image: userInput.image,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setKid(data);
          graphUpdate(true);
        });
      setEditable(false);
    }
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

  const deleteKid = () => {
    if (kid.all_id.length > 1) {
      let allId = kid.all_id.filter((users) => users._id !== user._id);
      fetch(`${BASE_URL}api/kids/${kid._id}`, {
        method: "POST",
        body: JSON.stringify({
          ...kid,
          all_id: allId,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setKid(data);
        });
    } else {
      fetch(`${BASE_URL}api/kids/${kid._id}`, {
        method: "DELETE",
        //JWT TOKEN
        body: JSON.stringify({ image: kid.image }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then((data) => {});
    }
    setRedirect(true);
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
      borderRadius: 10,
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
  };

  if (redirect) return <Redirect to={"/app"} />;

  return (
    <>
      <div
        className={`row-plain sm-padding width-400 ${
          kid.theme
        }-message birthday-${birthday === currentDate} side-shadow`}
      >
        <div className="cursor" onClick={() => setEditable(true)}>
          <img
            className={`md-profile-img ${kid.theme}-border right-sm-margin`}
            src={kid.image}
            alt={`${kid.first_name}'s img`}
          />
        </div>
        <div className="ellipsis">
          <h4 className="name" style={{ marginBottom: 10 }}>
            {kid.first_name} {kid.last_name}
          </h4>
          <div className="bold" style={{ marginBottom: 5 }}>
            Birthday: {birthDate}
          </div>
          <div className="bold" style={{ marginBottom: 10 }}>
            Age: {age}
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div
              className="cursor right-sm-margin"
              onClick={() => setEditable(true)}
            >
              <GrEdit />
            </div>
            <div className="cursor" onClick={deleteKid}>
              <GrTrash />
            </div>
          </div>
        </div>
      </div>
      <Modal
        closeTimeoutMS={300}
        isOpen={editable}
        ariaHideApp={false}
        onRequestClose={() => setEditable(false)}
        style={customStyles}
      >
        <form
          className="dark-text sm-padding"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <h4 className="text-center bottom-sm-margin">Edit Child</h4>
          <div className="form-split">
            <div style={{ marginRight: 30 }} className="form-section">
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
                  src={kid.image}
                  alt="default"
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
              <label className="bold top-sm-margin">
                Color Theme:
                <select
                  value={userInput.theme}
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
            </div>
            <div>
              <div className="form-split">
                <label>
                  <div className="bold" style={{ margin: 10, marginTop: 15 }}>
                    First Name:
                  </div>
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
                </label>
                <label>
                  <div className="bold" style={{ margin: 10, marginTop: 15 }}>
                    Last Name:
                  </div>
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
                </label>
              </div>
              {nameError ? (
                <div className="error text-center">Invalid Name</div>
              ) : null}

              <div className="bold" style={{ margin: 10, marginTop: 20 }}>
                Enter Birthdate:
              </div>
              <DatePicker
                selected={new Date(userInput.birth_date)}
                onChange={(date) => {
                  if (date === null) {
                    setDateError(true);
                  } else {
                    setDateError(false);
                  }
                  setUserInput((prev) => ({ ...prev, birth_date: date }));
                }}
              />
              {dateError ? (
                <div className="error text-center">Incorrect Date</div>
              ) : (
                <div>
                  <br />
                </div>
              )}
              <div className="row">
                <input
                  className="btn green-btn sm-width top-md-margin"
                  type="submit"
                  value="Edit"
                />
                <div
                  className="btn red-btn top-md-margin "
                  onClick={() => setEditable(false)}
                >
                  Cancel
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
