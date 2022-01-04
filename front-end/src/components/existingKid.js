import { useContext, useEffect, useState } from "react";
import { UserContext } from "./context";

const BASE_URL = "http://localhost:8080/";
const nameRegex = /^[a-z ,.'-]+$/i;

export default function ExistingKid({ setExistingChild }) {
  const [allKids, setAllKids] = useState();
  const [userInput, setUserInput] = useState({
    first_name: "",
    last_name: "",
  });
  const [user] = useContext(UserContext);
  const [filteredKids, setFilteredKids] = useState();
  const [error, setError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [hideSearch, setHideSearch] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}api/kids`)
      .then((res) => res.json())
      .then((data) => setAllKids(data));
  }, []);

  const restart = () => {
    setHideSearch(false);
    setFilteredKids();
    setUserInput({
      first_name: "",
      last_name: "",
    });
    setError(false);
    setNameError(false);
  };

  const handleSubmit = (e) => {
    if (!userInput.first_name || !userInput.last_name || nameError) {
      setNameError(true);
    } else {
      let kidArray = [];
      let ownKid = false;
      allKids.forEach((kid) => {
        kid.all_id.forEach((k, i) => {
          if (k._id === user._id) {
            ownKid = true;
          }
        });
        if (
          kid.first_name.toLowerCase() === userInput.first_name.toLowerCase() &&
          kid.last_name.toLowerCase() === userInput.last_name.toLowerCase() &&
          !ownKid
        ) {
          kidArray.push(kid);
        }
        ownKid = false;
      });
      if (kidArray.length === 0) {
        setError(true);
      } else {
        setError(false);
      }
      setHideSearch(true);
      setFilteredKids(kidArray);
    }
    e.preventDefault();
  };

  const addExistingKid = (kidID) => {
    fetch(`${BASE_URL}api/kids/${kidID}`)
      .then((res) => res.json())
      .then((data) => {
        let alreadyPending = false;
        data.pending.forEach((pend) => {
          if (pend._id === user._id) {
            alreadyPending = true;
          }
        });
        if (!alreadyPending) {
          fetch(`${BASE_URL}api/kids/${kidID}`, {
            method: "POST",
            body: JSON.stringify({ pending: [...data.pending, user] }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          })
            .then((res) => res.json())
            .then((data) => {
              setExistingChild(false);
              // TOASTIFY
            });
        } else {
          console.log("ALREADY PENDING AWAITING RESPONSE");
        }
      });
  };

  return (
    <div className="md-margin bottom-sm-margin">
      <form onSubmit={handleSubmit}>
        <h4 className="text-center bottom-sm-margin">Add Existing Child</h4>
        {error ? null : (
          <>
            {" "}
            <input
              className="input"
              type="text"
              placeholder="First Name*"
              value={userInput.first_name}
              name="first_name"
              onChange={(e) => {
                if (!nameRegex.test(e.target.value)) {
                  setNameError(true);
                } else {
                  setNameError(false);
                }
                setUserInput((prev) => ({
                  ...prev,
                  first_name: e.target.value,
                }));
              }}
            />
            <input
              className="input left-sm-margin"
              type="text"
              placeholder="Last Name*"
              value={userInput.last_name}
              name="last_name"
              onChange={(e) => {
                if (!nameRegex.test(e.target.value)) {
                  setNameError(true);
                } else {
                  setNameError(false);
                }
                setUserInput((prev) => ({
                  ...prev,
                  last_name: e.target.value,
                }));
              }}
            />
            <br />
          </>
        )}

        {nameError ? (
          <div className="error top-sm-margin text-center">Invalid Name</div>
        ) : null}
        {error ? (
          <div className="error top-sm-margin text-center">
            No Kids by that name
          </div>
        ) : null}
        <div className="row">
          {hideSearch ? (
            <div onClick={restart} className="btn red-btn top-sm-margin">
              Restart
            </div>
          ) : (
            <input
              className="btn green-btn sm-width top-sm-margin"
              type="submit"
              value="Search"
            />
          )}
        </div>
        <br />
        {filteredKids
          ? filteredKids.map((kid, index) => {
              return (
                <div key={`FilteredKid_${index}`}>
                  <div className="row">
                    <img
                      className={`profile-img ${kid.theme}-border`}
                      src={kid.image}
                      alt="kid_img"
                    />
                  </div>
                  <h5 className="text-center sm-padding">
                    {kid.first_name} {kid.last_name}
                  </h5>
                  <div className="row">
                    <div
                      onClick={() => addExistingKid(kid._id)}
                      className={`btn ${kid.theme}-btn`}
                    >
                      Add Kid
                    </div>
                  </div>
                  <div className="border-line top-sm-margin"></div>
                </div>
              );
            })
          : null}
      </form>
    </div>
  );
}
