import { useEffect, useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { TokenContext, UserContext } from "./context";

const BASE_URL = "http://localhost:8080/";
const nameRegex = /^[a-z ,.'-]+$/i;
const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export default function UserForm({ form }) {
  return <>{form === "Sign Up" ? <SignUpForm /> : <LoginForm />}</>;
}

const SignUpForm = () => {
  const [userInput, setUserInput] = useState({
    email: "",
    first_name: "",
    last_name: "",
    image: "",
    company_name: "",
    is_daycare: false,
    theme: "blue",
    password: "",
  });
  const [confirm, setConfirm] = useState("");
  const [uploadedImg, setUploadedImg] = useState(null);
  const [tempImg, setTempImg] = useState();
  const [hasError, setHasError] = useState(false);
  const [errors, setErrors] = useState({
    email: true,
    first_name: true,
    last_name: true,
    password: true,
    confirm_password: true,
    company_name: false,
  });
  const [error, setError] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (userInput.image && !hasError) {
      fetch(`${BASE_URL}api/signup`, {
        method: "POST",
        body: JSON.stringify(userInput),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then((data) => setRedirect(true));
    }
  }, [userInput, errors, hasError]);

  const validate = (input, name, condition) => {
    if (!input || !condition) {
      setErrors((prev) => ({ ...prev, [name]: true }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = (e) => {
    let checkAllErrors = Object.values(errors).includes(true);
    setHasError(checkAllErrors);

    if (!checkAllErrors) {
      if (uploadedImg) {
        let formData = new FormData();
        formData.append("image", uploadedImg);
        fetch(`${BASE_URL}api/images`, {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            setUserInput((prev) => ({
              ...prev,
              image: `${BASE_URL}images/${data.filename}`,
            }));
          })
          .catch((err) => console.log(err));
      } else {
        setUserInput((prev) => ({
          ...prev,
          image: `https://ui-avatars.com/api/?background=f6f6f6&bold=true&size=150&name=${userInput.first_name} ${userInput.last_name}`,
        }));
      }
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

  if (redirect) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <form
        className="form"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <h3 className="bottom-md-margin kid-font">Sign Up</h3>
        <div className="form-split">
          <div className="form-section form-width">
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
                className={`profile-img ${userInput.theme}-border`}
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
            <img
              style={{ width: "100%", marginTop: 10 }}
              src={`/images/${userInput.theme}.png`}
              alt="color-theme"
            />
          </div>
          <div className="left-md-margin">
            <div className="form-split">
              <input
                className={
                  errors.first_name && hasError ? "input input-error" : "input"
                }
                type="text"
                placeholder="First Name*"
                value={userInput.first_name}
                name="first_name"
                onChange={(e) => {
                  setUserInput((prev) => ({
                    ...prev,
                    first_name: e.target.value,
                  }));
                  validate(
                    e.target.value,
                    "first_name",
                    nameRegex.test(e.target.value)
                  );
                }}
              />
              <input
                className={
                  errors.last_name && hasError
                    ? "input left-sm-margin input-error"
                    : "input left-sm-margin"
                }
                type="text"
                placeholder="Last Name*"
                value={userInput.last_name}
                name="last_name"
                onChange={(e) => {
                  setUserInput((prev) => ({
                    ...prev,
                    last_name: e.target.value,
                  }));
                  validate(
                    e.target.value,
                    "last_name",
                    nameRegex.test(e.target.value)
                  );
                }}
              />
            </div>
            {(errors.first_name || errors.last_name) && hasError ? (
              <div className="error">
                Invalid Full Name (Must Have 1 Character)
              </div>
            ) : (
              <>
                <br />
              </>
            )}

            <input
              className={errors.email && hasError ? "input-error" : ""}
              type="text"
              placeholder="Email*"
              value={userInput.email}
              name="email"
              onChange={(e) => {
                setUserInput((prev) => ({ ...prev, email: e.target.value }));
                validate(
                  e.target.value,
                  "email",
                  emailRegex.test(e.target.value)
                );
              }}
            />
            <br />
            {errors.email && hasError ? (
              <div className="error">Invalid Email (Correct: abc@mail.com)</div>
            ) : (
              <>
                <br />
              </>
            )}

            <input
              className={errors.password && hasError ? "input-error" : ""}
              type="password"
              placeholder="Password*"
              value={userInput.password}
              name="password"
              onChange={(e) => {
                setUserInput((prev) => ({ ...prev, password: e.target.value }));
                validate(
                  e.target.value,
                  "password",
                  passwordRegex.test(e.target.value)
                );
                if (userInput.confirm_password !== e.target.value) {
                  setErrors((prev) => ({ ...prev, confirm_password: true }));
                } else {
                  setErrors((prev) => ({ ...prev, confirm_password: false }));
                }
              }}
            />
            <br />
            {errors.password && hasError ? (
              <div className="error">
                Invalid Password (8 Characters, 1 Letter, 1 Number)
              </div>
            ) : (
              <>
                <br />
              </>
            )}
            <input
              className={
                errors.confirm_password && hasError ? "input-error" : ""
              }
              type="password"
              placeholder="Confirm Password*"
              value={confirm}
              name="confirm"
              onChange={(e) => {
                setConfirm(e.target.value);
                if (e.target.value !== userInput.password) {
                  setErrors((prev) => ({ ...prev, confirm_password: true }));
                } else {
                  setErrors((prev) => ({ ...prev, confirm_password: false }));
                }
              }}
            />
            <br />
            {errors.confirm_password && hasError ? (
              <div className="error">Passwords Must Match</div>
            ) : (
              <>
                <br />
              </>
            )}
            <label style={{ fontWeight: "bold" }}>
              Are You A Daycare?
              <input
                className="checkbox"
                type="checkbox"
                value={userInput.is_daycare}
                name="is_daycare"
                onChange={(e) => {
                  setUserInput((prev) => ({
                    ...prev,
                    is_daycare: e.target.checked,
                  }));
                  if (e.target.checked) {
                    setErrors((prev) => ({ ...prev, company_name: true }));
                  } else {
                    setUserInput((prev) => ({
                      ...prev,
                      company_name: "",
                    }));
                  }
                }}
              />
            </label>
            <br />
            <br />
            {userInput.is_daycare ? (
              <>
                <input
                  className={
                    errors.company_name && hasError ? "input-error" : ""
                  }
                  type="text"
                  placeholder="Company Name*"
                  value={userInput.company_name}
                  name="company_name"
                  onChange={(e) => {
                    setUserInput((prev) => ({
                      ...prev,
                      company_name: e.target.value,
                    }));
                    if (!e.target.value && userInput.is_daycare) {
                      setErrors((prev) => ({ ...prev, company_name: true }));
                    } else {
                      setErrors((prev) => ({ ...prev, company_name: false }));
                    }
                  }}
                />
                <br />
              </>
            ) : (
              <></>
            )}
            {errors.company_name && hasError ? (
              <div className="error">
                Invalid Company Name (Must Have 1 Character)
              </div>
            ) : (
              <>
                <br />
              </>
            )}
            <input
              className="btn green-btn sm-width"
              type="submit"
              value="Submit"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

const LoginForm = () => {
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  });
  const [, setUser] = useContext(UserContext);
  const [, setToken] = useContext(TokenContext);
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    let mounted = true;
    if (mounted) {
      fetch("http://localhost:8080/api/login", {
        method: "POST",
        body: JSON.stringify(userInput),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            setError(true);
          } else {
            localStorage.setItem("User", JSON.stringify(data.user));
            localStorage.setItem("Token", JSON.stringify(data.token));
            setToken(`JWT ${data.token}`);
            setUser(data.user);
            setRedirect(true);
          }
        });
    }
    e.preventDefault();
  };

  if (redirect) return <Redirect to={"/app"} />;

  return (
    <div style={{ width: 350 }}>
      <form className="form" onSubmit={handleSubmit}>
        <h3 className="bottom-sm-margin kid-font">Login</h3>
        <input
          className={error ? "input-error" : null}
          type="text"
          placeholder="Email*"
          value={userInput.email}
          name="email"
          onChange={(e) =>
            setUserInput((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <br />
        <br />
        <input
          className={error ? "input-error" : null}
          type="password"
          placeholder="Password*"
          value={userInput.password}
          name="password"
          onChange={(e) =>
            setUserInput((prev) => ({ ...prev, password: e.target.value }))
          }
        />
        <br />
        <br />
        {error ? <div className="error">Invalid Email/Password</div> : <></>}
        <input
          className="btn green-btn sm-width"
          type="submit"
          value="Submit"
        />
      </form>
    </div>
  );
};
