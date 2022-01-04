import { Link } from "react-router-dom";
import { useEffect } from "react";
import UserForm from "../components/userForm";
import Card from "../components/card";
import Aos from "aos";
import "aos/dist/aos.css";

export default function Home() {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <>
      <div className="pg content">
        <div data-aos="fade-right" className="content-msg">
          <h1>Caring For Our Future</h1>
          <h5 className="light-text top-sm-padding bottom-md-padding">
            Helping parents and daycares have the best experience with their
            little explorers.
          </h5>
          <Link className="btn teal-btn sm-width" to="/signup">
            Get Started
          </Link>
        </div>
        <div data-aos="fade-right" className="content-img">
          <img
            clasNsName="move-vertically "
            src="/images/kidOnRocket.png"
            alt="rocket-icon"
          />
        </div>
      </div>
      <img className="wave-img" src="/images/waveBackground.png" alt="wave" />
      <div className="white-pg text-center bottom-lg-padding">
        <h2 className="top-md-margin" data-aos="fade-right">
          What is KidSpace?
        </h2>
        <h6 className="sm-margin" data-aos="fade-right">
          We help organize and keep track of your children's growth, behaviors,
          and many more!
        </h6>
        <div
          data-aos="fade-right"
          className="sm-content-img center-img top-lg-margin bottom-lg-margin"
        >
          <img
            className="move-horizontally"
            src="/images/chasingMonster.png"
            alt="test"
          />
        </div>

        <Link className="btn blue-btn" to="/signup">
          Start Now
        </Link>
      </div>
      <img
        className="wave-img"
        src="/images/downWaveBackground.png"
        alt="wave"
      />
      <div className="content flip top-lg-margin bottom-lg-margin">
        <div
          data-aos="fade-right"
          className="sm-content-img top-sm-margin bottom-lg-margin text-center"
        >
          <img
            className="move-vertically"
            src="/images/blueKid.png"
            alt="test"
          />
          <img
            className="move-vertically-2"
            src="/images/redKid.png"
            alt="test"
          />
        </div>
        <div
          style={{ height: 250 }}
          data-aos="fade-left"
          className="content-msg top-lg-margin bottom-lg-margin"
        >
          <h2>Our Mission</h2>
          <br />
          <h6>
            We want to optimize your experience as a parent and caretaker.
          </h6>
          <br />
          <h6>
            In order to do so we help keep track of data as well as offer
            communicative measures to help meet your needs!
          </h6>
          <br />
          <h6 className="bottom-sm-margin">
            Already a Member? Click the button below.
          </h6>
          <Link className="btn teal-btn x-sm-width " to="/login">
            Login
          </Link>
        </div>
      </div>
      <img className="wave-img" src="/images/waveBackground.png" alt="wave" />
      <div className="white-pg text-center top-lg-padding bottom-lg-padding">
        <h2>How It Works</h2>
        <br />
        <h6>It's just 3 easy steps, Sign-Up, Login, and Get Started!</h6>
        <br />
        <div className="row-center">
          <img
            className="sm-margin"
            style={{ width: 300 }}
            src="/images/SignUp.jpg"
            alt="test"
          />
          <img
            className="sm-margin"
            style={{ width: 300 }}
            src="/images/Login.jpg"
            alt="test"
          />
          <img
            className="sm-margin bottom-lg-margin"
            style={{ width: 300 }}
            src="/images/Main.jpg"
            alt="test"
          />
        </div>
        <Link className="btn blue-outline-btn" to="/for-parents">
          Parents
        </Link>
        <Link className="btn blue-btn left-sm-margin" to="/for-daycares">
          Daycare
        </Link>
      </div>
      <img
        className="wave-img"
        src="/images/downWaveBackground.png"
        alt="wave"
      />
      <h2 data-aos="fade-up" className="text-center top-lg-margin">
        Astronaut Reviews
      </h2>
      <div data-aos="fade-up" className="content">
        <Card
          img="/images/Andrew.jpeg"
          name="Andrew"
          msg="I heard a friend talk about it so I gave it a shot... And I'm not disappointed!"
        />
        <Card
          img="/images/Candice.jpeg"
          name="Candice"
          msg="Super fun and easy to use! I use it everyday!"
        />
        <Card
          img="/images/Jimmy.jpg"
          name="Jimmy"
          msg="I love this application and I can't wait to see what else they can do to improve!"
        />
      </div>
      <div data-aos="fade-up" className="content bottom-lg-margin"></div>
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
