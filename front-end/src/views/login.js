import UserForm from "../components/userForm";
import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";

export default function Login() {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          paddingTop: 200,
        }}
        data-aos="fade-right"
        className="pg content hide-extra"
      >
        <UserForm />
        <div className="lg-margin">
          <div className="x-sm-content-img">
            <img
              className="move-vertically x-sm-img"
              src="/images/blueKid.png"
              alt="test"
            />
            <img
              className="move-vertically-2 x-sm-img"
              src="/images/redKid.png"
              alt="test"
            />
          </div>
        </div>
      </div>
      <img
        className="wave-img bottom"
        src="/images/waveBackground.png"
        alt="bg"
      />
    </>
  );
}
