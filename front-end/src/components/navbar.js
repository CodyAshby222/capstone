import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AccountSettings from "../views-app/accountSettings";
import { TokenContext, UserContext } from "./context";
import { GiHamburgerMenu } from "react-icons/gi";

export default function Navbar() {
  const [user, setUser] = useContext(UserContext);
  const [, setToken] = useContext(TokenContext);
  const [background, setBackground] = useState(true);
  const logout = () => {
    localStorage.clear();
    setUser();
    setToken();
  };
  const [openMenu, setOpenMenu] = useState(false);

  const changeBackground = () => {
    if (window.scrollY > 80) {
      setBackground(true);
    } else {
      setBackground(false);
    }
  };

  window.addEventListener("scroll", changeBackground);

  return (
    <>
      {user ? (
        <div className={background ? "nav active" : "nav"}>
          <div className="nav-content">
            <Link className="btn title" to="/">
              <img
                className="nav-logo"
                src="/images/rocket-icon.png"
                alt="KidSpace"
              />
              <div>KidSpace</div>
            </Link>
            <div className="row">
              <AccountSettings />
              <div onClick={logout} className="btn green-btn cursor">
                Logout
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={background ? "nav active" : "nav"}>
          <div className="nav-content">
            <Link className="btn title" to="/">
              <img
                className="nav-logo"
                src="/images/rocket-icon.png"
                alt="KidSpace"
              />
              <div>KidSpace</div>
            </Link>
            <div className="hide-nav">
              <Link className="transparent-btn" to="/for-parents">
                For Parents
              </Link>
              <Link className="transparent-btn" to="/for-daycares">
                For Daycares
              </Link>
              <Link className="transparent-btn" to="/login">
                Login
              </Link>
              <Link className="btn teal-btn" to="/signup">
                Sign Up
              </Link>
            </div>
            <div
              style={{ fontSize: 30 }}
              onClick={() => setOpenMenu((prev) => !prev)}
              className="cursor hide-mobile"
            >
              <GiHamburgerMenu />
            </div>
          </div>
          {openMenu ? (
            <div
              onClick={() => setOpenMenu(false)}
              className="nav-content-2 hide-mobile"
            >
              <Link
                className="transparent-btn-2 top-sm-padding bottom-sm-padding"
                to="/for-parents"
              >
                For Parents
              </Link>
              <Link
                className="transparent-btn-2 top-sm-padding bottom-sm-padding"
                to="/for-daycares"
              >
                For Daycares
              </Link>
              <Link
                className="transparent-btn-2 top-sm-padding bottom-sm-padding"
                to="/login"
              >
                Login
              </Link>
              <Link
                className="transparent-btn-2 top-sm-padding bottom-sm-padding"
                to="/signup"
              >
                Sign Up
              </Link>
            </div>
          ) : null}
        </div>
      )}
      <div className="nav-line"></div>
    </>
  );
}
