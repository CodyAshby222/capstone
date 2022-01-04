import { Link } from "react-router-dom";
import UserForm from "../components/userForm";
import { useState, useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";

export default function ForParents() {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);
  const [randomQuote, setRandomQuote] = useState();
  useEffect(() => {
    fetch("json/parentQuotes.json", {
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
  return (
    <>
      <div className="pg content">
        <div data-aos="fade-left" className="top-lg-margin bottom-lg-margin">
          <h1 className="text-center">For Parents</h1>
          <h5 className="width-400 light-text text-center top-sm-padding bottom-md-padding">
            {randomQuote ? (
              <>
                <h6>{randomQuote.quote}</h6>
                <h6>-{randomQuote.author}</h6>
                {/* <div className="source top-sm-margin">
                  https://tootris.com/edu/blog/providers/40-inspirational-quotes-child-care-daycare-providers/
                </div>
                <div className="source">
                  https://www.wisesayings.com/childcare-quotes/
                </div> */}
              </>
            ) : null}
          </h5>
        </div>
      </div>
      <img className="wave-img" src="/images/waveBackground.png" alt="wave" />
      <div className="white-pg">
        <div className="content">
          <div data-aos="fade-right" className="content-msg">
            <h2>Why KidSpace?</h2>
            <br />
            <h6>
              Being able to track your kids daily activities is vital in today's
              fast paced world. You as a parent/guardian want the best for your
              little one.
            </h6>
            <br />
            <h6>
              In order to do so we provided you an application that helps you
              communicate with others, store documents for your kid, and even
              keep track of feeding, diaper changes, and much more!
            </h6>
            <br />
            <br />
            <div>
              <Link className="btn green-btn" to="/signup">
                Get Started
              </Link>
            </div>
          </div>
          <div data-aos="fade-left" className="content-msg">
            <img src="/images/kidWalkingWithParent.png" alt="test" />
          </div>
        </div>
      </div>
      <img
        className="wave-img"
        src="/images/downWaveBackground.png"
        alt="wave"
      />

      <h2 className="text-center top-lg-margin bottom-sm-margin">
        Getting Started
      </h2>
      <h6 style={{ margin: "0 auto" }} className="text-center width-700">
        To get started you'll login, then you'll be taken to the main page
        (first image). Here you can add a new child, add an existing child, or
        share inspirational messages. Once you click on the child and access
        data, private messaging, documents, and many more!{" "}
      </h6>
      <div className="content top-md-margin bottom-lg-margin">
        <div className="row-center">
          <img
            className="sm-margin"
            style={{ width: 300, border: "2px solid white" }}
            src="/images/Main.jpg"
            alt="test"
          />
          <img
            className="sm-margin"
            style={{ width: 300, border: "2px solid white" }}
            src="/images/Data.jpg"
            alt="test"
          />
          <img
            className="sm-margin"
            style={{ width: 300, border: "2px solid white" }}
            src="/images/Graph.jpg"
            alt="test"
          />
        </div>
      </div>

      <img className="wave-img" src="/images/waveBackground.png" alt="wave" />
      <div className="white-pg text-center">
        <div
          data-aos="fade-right"
          className="content bottom-lg-margin"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div className="row-center top-md-margin bottom-md-margin">
            <h5 className="right-sm-margin">Already A Member?</h5>
            <Link className="btn blue-btn x-sm-width" to="/login">
              Login
            </Link>
          </div>
          <UserForm form="Sign Up" />
        </div>
      </div>
    </>
  );
}
