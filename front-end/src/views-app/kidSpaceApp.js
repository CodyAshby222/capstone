import { useContext, useEffect, useState } from "react";
import { KidContext, UserContext } from "../components/context";
import { Link } from "react-router-dom";
import KidForm from "../components/kidForm";
import ExistingKid from "../components/existingKid";
import { BsPlusCircleFill } from "react-icons/bs";
import PublicRoom from "./publicChat";
import Modal from "react-modal";
import Aos from "aos";
import "aos/dist/aos.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = "http://localhost:8080/";

const KidSpaceApp = () => {
  const [user] = useContext(UserContext);
  const [kids, setKids] = useContext(KidContext);
  const [ageRange, setAgeRange] = useState("all");
  const [age, setAge] = useState({ min: 0, max: 1000 });
  const [randomQuote, setRandomQuote] = useState();
  const [addChild, setAddChild] = useState(false);
  const [existingChild, setExistingChild] = useState(false);
  const [publicChat, setPublicChat] = useState(false);
  const [currentDate] = useState(() => {
    let currentFullDate = new Date();
    let currentMonth = (currentFullDate.getMonth() + 1)
      .toString()
      .padStart(2, "0");
    let currentDay = currentFullDate.getDate().toString().padStart(2, "0");
    return `${currentMonth}/${currentDay}`;
  });

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    fetch("json/daycareQuotes.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const random = Math.floor(Math.random() * data.quotes.length);
        setRandomQuote({
          quote: data.quotes[random].quote,
          author: data.quotes[random].author,
        });
      });
  }, []);

  useEffect(() => {
    if (user?._id) {
      fetch(`${BASE_URL}api/kids`)
        .then((res) => res.json())
        .then((data) => {
          let kids = [];
          data.forEach((kid) => {
            kid.all_id.forEach((otherUser) => {
              if (otherUser._id === user._id) {
                kids.push(kid);
              }
            });
          });
          setKids(kids);
        });
    }
  }, [setKids, user?._id]);

  const acceptUser = (pendingUser, kid) => {
    toast.success(`Successfully Added`, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    const newPending = kid.pending.filter(
      (user) => user._id !== pendingUser._id
    );
    const newKid = {
      ...kid,
      all_id: [...kid.all_id, pendingUser],
      pending: newPending,
    };

    fetch(`${BASE_URL}api/kids/${kid._id}`, {
      method: "POST",
      body: JSON.stringify(newKid),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        let newKids = [...kids];
        newKids.forEach((kid, index) => {
          if (kid._id === data._id) {
            newKids[index] = data;
          }
        });
        setKids(newKids);
      });
  };

  const declineUser = (pendingUser, kid) => {
    toast.error(`Successfully Declined`, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    const newPending = kid.pending.filter(
      (user) => user._id !== pendingUser._id
    );
    const newKid = {
      ...kid,
      pending: newPending,
    };

    fetch(`${BASE_URL}api/kids/${kid._id}`, {
      method: "POST",
      body: JSON.stringify(newKid),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        let newKids = [...kids];
        newKids.forEach((kid, index) => {
          if (kid._id === data._id) {
            newKids[index] = data;
          }
        });
        setKids(newKids);
      });
  };

  const handleAge = (e) => {
    if (e.target.value === "all") {
      setAge({ min: 0, max: 1000 });
    }
    if (e.target.value === "zeroTwo") {
      setAge({ min: 0, max: 2 });
    }
    if (e.target.value === "threeFour") {
      setAge({ min: 3, max: 4 });
    }
    if (e.target.value === "fiveSix") {
      setAge({ min: 5, max: 6 });
    }
    if (e.target.value === "sevenEight") {
      setAge({ min: 7, max: 8 });
    }
    if (e.target.value === "nineTen") {
      setAge({ min: 9, max: 10 });
    }
    if (e.target.value === "elevenPlus") {
      setAge({ min: 11, max: 1000 });
    }
    setAgeRange(e.target.value);
  };

  const setAddChildCallBack = (newState) => {
    setAddChild(newState);
  };

  const setExistingChildCallBack = (newState) => {
    toast.success(`Child Added - Waiting For Response`, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setExistingChild(newState);
  };

  const setPublicChatCallBack = (newState) => {
    setPublicChat(newState);
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

  if (user) {
    return (
      <>
        <div data-aos="fade-right" className="pg content-3">
          {user.company_name ? (
            <h2 className="kid-font text-center">
              Welcome {user.company_name}!
            </h2>
          ) : (
            <h2 className="kid-font text-center">Welcome {user.first_name}!</h2>
          )}

          <div className="white-bg width-700 zero-padding top-sm-margin">
            <div
              className={`md-padding data-${user.theme}-buttons no-transform row-space-between`}
            >
              <h3>Select A Child</h3>
              {user.is_daycare ? (
                <label className="bold">
                  Age Range:
                  <select value={ageRange} onChange={handleAge}>
                    <option value="all">All</option>
                    <option value="zeroTwo">0-2</option>
                    <option value="threeFour">3-4</option>
                    <option value="fiveSix">5-6</option>
                    <option value="sevenEight">7-8</option>
                    <option value="nineTen">9-10</option>
                    <option value="elevenPlus">11+</option>
                  </select>
                </label>
              ) : (
                <div></div>
              )}
            </div>
            {kids?.length > 0 ? (
              kids.map((kid, index) => {
                let birthdate = new Date(kid.birth_date);
                let difference = Date.now() - birthdate.getTime();
                let ageDiff = new Date(difference);
                let kidAge = Math.abs(ageDiff.getUTCFullYear() - 1970);
                if (kidAge >= age.min && kidAge <= age.max) {
                  let birthdayArr = kid.birth_date.split("T");
                  let birthday = birthdayArr[0].split("-");
                  let updateDay = parseInt(birthday[2] - 1)
                    .toString()
                    .padStart(2, "0");
                  let fullBirthday = `${birthday[1]}/${updateDay}/${birthday[0]}`;
                  let birthdayCheck = `${birthday[1]}/${updateDay}`;
                  let isBirthdayToday = birthdayCheck === currentDate;
                  return (
                    <div key={`KidSpaceApp_${index}`}>
                      <div
                        className={`row-plain sm-padding grey-hover birthday-${isBirthdayToday}`}
                        style={{
                          marginBottom: 20,
                          display: "flex",
                          flexWrap: "wrap",
                        }}
                        key={`Kid_${index}`}
                      >
                        <div className="row-plain">
                          <Link
                            style={{ width: 150 }}
                            className="dark-text"
                            to={`/app/${kid._id}`}
                          >
                            <img
                              className={`md-profile-img ${kid.theme}-border left-sm-margin`}
                              src={kid.image}
                              alt="kid_img"
                            />
                          </Link>
                          <Link
                            style={{ width: 280 }}
                            className="dark-text sm-padding"
                            to={`/app/${kid._id}`}
                          >
                            <h4 className="bottom-sm-margin ellipsis name">
                              {kid.first_name} {kid.last_name}
                            </h4>
                            <div className="bold" style={{ marginBottom: 5 }}>
                              Birthday: {fullBirthday}
                            </div>
                            <div className="bold">Age: {kidAge}</div>
                          </Link>
                        </div>
                        {kid.pending.map((pendingUser, i) => {
                          return (
                            <div
                              key={`pe_${i}`}
                              style={{ width: 150 }}
                              className="text-center"
                            >
                              <div>Add Request:</div>
                              <h6
                                className="ellipsis"
                                style={{ marginBottom: 15 }}
                              >
                                {pendingUser.first_name} {pendingUser.last_name}{" "}
                              </h6>
                              <div
                                style={{ marginBottom: 10, marginLeft: 7 }}
                                onClick={() => acceptUser(pendingUser, kid)}
                                className="btn green-btn sm-width"
                              >
                                Accept
                              </div>
                              <div
                                style={{ marginBottom: 10, marginLeft: 7 }}
                                onClick={() => declineUser(pendingUser, kid)}
                                className="btn red-btn sm-width"
                              >
                                Decline
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {index < kids.length - 1 ? (
                        <div
                          key={`BorderLine_${index}`}
                          className="border-line"
                        ></div>
                      ) : null}
                    </div>
                  );
                }
                return null;
              })
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <h6 className="text-center md-margin left-lg-margin right-lg-margin">
                  Hello {user.first_name}! It looks like you have no kids. To
                  add new or existing children click the buttons below.
                </h6>
                {user.is_daycare ? (
                  <img
                    className="bottom-md-padding"
                    src="/images/daycareTeaching.png"
                    alt="daycare"
                  />
                ) : (
                  <img
                    className="bottom-md-padding"
                    src="/images/kidWalkingWithParent.png"
                    alt="parent"
                  />
                )}
              </div>
            )}
          </div>

          <div className="cursor" onClick={() => setAddChild(true)}>
            <div
              style={{
                borderRadius: 10,
                marginTop: 20,
                marginLeft: 20,
                marginRight: 20,
                marginBottom: 10,
              }}
              className="width-700 green-btn row-plain"
            >
              <div style={{ fontSize: 50, marginTop: 15, marginLeft: 30 }}>
                <BsPlusCircleFill />
              </div>
              <h4 className="md-padding cursor">Add Child</h4>
            </div>
          </div>

          <div className="width-700 row-space-between">
            <div
              className="btn transparent-btn"
              onClick={() => setExistingChild(true)}
            >
              Existing Child? Click Here
            </div>
            <div
              className="btn transparent-btn"
              onClick={() => setPublicChat(true)}
            >
              Click Here Access To Public Chat
            </div>
          </div>

          <Modal
            closeTimeoutMS={300}
            isOpen={addChild}
            ariaHideApp={false}
            onRequestClose={() => setAddChild(false)}
            style={customStyles}
          >
            <div className="dark-text">
              <KidForm userObj={user} setAddChild={setAddChildCallBack} />
            </div>
          </Modal>

          <Modal
            closeTimeoutMS={300}
            isOpen={existingChild}
            ariaHideApp={false}
            onRequestClose={() => setExistingChild(false)}
            style={customStyles}
          >
            <div className="dark-text">
              <ExistingKid setExistingChild={setExistingChildCallBack} />
            </div>
          </Modal>

          {publicChat ? (
            <div className="lg-margin">
              <PublicRoom setPublicChat={setPublicChatCallBack} />
            </div>
          ) : (
            <div className="sm-margin"></div>
          )}
          {randomQuote ? (
            <div className={`row-space-between top-sm-margin bottom-lg-margin`}>
              <img
                style={{ width: 150, margin: "0px auto" }}
                src="/images/blueKid.png"
                alt="AstroKid"
              />
              <div
                style={{ width: 450, margin: "0px auto" }}
                className="quote sm-padding"
              >
                <h5 className="text-underline bottom-sm-margin">
                  Quote Of The Day
                </h5>
                <h5>{randomQuote.quote}</h5>
                <h6>-{randomQuote.author}</h6>
                {/* <div className="source top-sm-margin">
                https://tootris.com/edu/blog/providers/40-inspirational-quotes-child-care-daycare-providers/
              </div>
              <div className="source">
                https://www.wisesayings.com/childcare-quotes/
              </div> */}
              </div>
            </div>
          ) : null}

          <div className="md-margin"></div>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={true}
        />
      </>
    );
  } else {
    return null;
  }
};

export default KidSpaceApp;
