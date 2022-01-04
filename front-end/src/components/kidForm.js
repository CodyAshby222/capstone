import { useState, useEffect, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { KidContext } from "./context";

const BASE_URL = "http://localhost:8080/";
const nameRegex = /^[a-z ,.'-]+$/i;

export default function KidForm({ userObj, setAddChild }) {
  const [userInput, setUserInput] = useState({
    all_id: [],
    first_name: "",
    last_name: "",
    birth_date: new Date(),
    image: "",
    theme: "blue",
    diaper: [],
    sleep: [],
    feeding: [],
    behavior: [],
    pending: [],
    private_chat: [],
    document: [
      "http://localhost:8080/documents/1-BehaviorReport.docx",
      "http://localhost:8080/documents/2-EmergencyContact.pdf",
      "http://localhost:8080/documents/3-Registration.pdf",
      "http://localhost:8080/documents/4-IncidentReport.docx",
    ],
  });
  const [uploadedImg, setUploadedImg] = useState(null);
  const [tempImg, setTempImg] = useState();
  const [, setKids] = useContext(KidContext);
  const [error, setError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [nameError, setNameError] = useState(false);

  useEffect(() => {
    setUserInput((prev) => ({ ...prev, all_id: userObj }));
  }, [userObj]);

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
      if (uploadedImg) {
        let formData = new FormData();
        formData.append("image", uploadedImg);

        fetch(`${BASE_URL}api/images`, {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            fetch(`${BASE_URL}api/kids`, {
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
              .then((data) => setKids((prev) => [...prev, data]));
          })
          .catch((err) => console.log(err));
      } else {
        fetch(`${BASE_URL}api/kids`, {
          method: "POST",
          body: JSON.stringify({
            ...userInput,
            image: `https://ui-avatars.com/api/?background=f6f6f6&bold=true&size=150&name=${userInput.first_name} ${userInput.last_name}`,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((res) => res.json())
          .then((data) => setKids((prev) => [...prev, data]));
      }
      setAddChild(false);
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

  return (
    <div className="md-margin">
      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <h4 className="bottom-sm-margin text-center">Add Child</h4>
        <div className="row">
          <div className="form-section right-md-margin">
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
                src={`https://ui-avatars.com/api/?background=f6f6f6&bold=true&size=150&name=${userInput.first_name} ${userInput.last_name}`}
                alt="default"
              />
            )}
            {error ? (
              <div className="error">Invalid Image (.jpeg, .jpg, .png)</div>
            ) : null}
            <label className="btn teal-outline-btn top-sm-margin">
              <input type="file" name="image" onChange={fileSelectedHandler} />
              Upload
            </label>
          </div>
          <div>
            <div className="form-split top-sm-margin">
              <label>
                <div
                  style={{ marginBottom: 8 }}
                  className="left-sm-margin bold"
                >
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
                <div
                  style={{ marginBottom: 8 }}
                  className="left-md-margin bold"
                >
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
            ) : (
              <div>
                <br />
              </div>
            )}

            <div className="bold" style={{ marginBottom: 8, marginLeft: 15 }}>
              Enter Birthdate:
            </div>

            <DatePicker
              className={dateError ? "input-error" : null}
              selected={userInput.birth_date}
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
            <div style={{ marginTop: 25 }} className="text-center">
              <label className="bold">
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
            <br />
            <div className="row">
              <input
                className="btn green-btn sm-width"
                type="submit"
                value="Submit"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
