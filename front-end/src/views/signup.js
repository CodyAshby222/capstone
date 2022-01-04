import UserForm from "../components/userForm";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";

export default function SignUp() {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);
  return (
    <>
      <div
        data-aos="fade-left"
        style={{ paddingTop: 150 }}
        className="pg content switch hide-extra"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{ width: 220 }}
            className="top-lg-margin x-sm-content-img asdf"
          >
            <img
              className="move-vertically sm-img "
              src="/images/kidOnRocket.png"
              alt="rocket-icon"
            />
          </div>
          <h4 className="kid-font bottom-sm-margin top-md-margin">
            Already A Member?
          </h4>
          <Link className="btn green-btn bottom-lg-margin" to="/login">
            Login
          </Link>
        </div>
        <UserForm form="Sign Up" />
      </div>
      <img
        className="wave-img bottom"
        src="/images/waveBackground.png"
        alt="bg"
      />
    </>
  );
}
