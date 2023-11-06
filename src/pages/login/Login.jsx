import { useState } from "react";
import { FaUserTie } from "react-icons/fa";
import { BiSolidLockAlt } from "react-icons/bi";
import { BsChevronRight } from "react-icons/bs";
import { useCookies } from "react-cookie";
import fetchDataFromApi from "../../utils/api.js";
import Modal from "react-responsive-modal";
import Loader from "../../components/ui/loader/Loader.jsx";
import "./style.scss";

function Login() {
  const [cookies, setCookie] = useCookies(["uid"]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({ username: "", password: "" });
  const [errorModal, setErrorModal] = useState({ modal: false, error: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    // name: 'University', password: 'vPjLZw626v9W'
    if (userData.username != "" && userData.password != "") {
      setLoading(true)
      let response = await fetchDataFromApi(
        "auth/login",
        { name: userData.username, password: userData.password },
        "post"
      );
      setUserData({ username: "", password: "" });
      setLoading(false)
      response.data.errorMessage ? 
      setErrorModal({ error: response.data.errorMessage, modal: true }) : 
      setCookie("uid", response.data.uid);
    }
  }

  return (
    loading ? 
    <Loader /> :
    <div className="login-container">
      <div className="screen">
        <div className="screen__content">
          <form className="login" onSubmit={handleSubmit}>
            <div className="login__field">
              <FaUserTie className="login__icon" />
              <input
                value={userData.username}
                onChange={(e) =>
                  setUserData({ ...userData, username: e.target.value })
                }
                type="text"
                className="login__input"
                placeholder="Username"
              />
            </div>
            <div className="login__field">
              <BiSolidLockAlt className="login__icon" />
              <input
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
                type="password"
                className="login__input"
                placeholder="Password"
              />
            </div>
            <button className="button login__submit">
              <span className="button__text">Log In</span>
              <BsChevronRight className="button__icon" />
            </button>
          </form>
        </div>
        <div className="screen__background">
          <span className="screen__background__shape screen__background__shape4"></span>
          <span className="screen__background__shape screen__background__shape3"></span>
          <span className="screen__background__shape screen__background__shape2"></span>
          <span className="screen__background__shape screen__background__shape1"></span>
        </div>
      </div>

      <Modal
        classNames={{ modal: "error-modal" }}
        open={errorModal.modal}
        onClose={() => {
          setErrorModal({ error: "", modal: false });
        }}
        center
      >
        <span>
          {errorModal.error.charAt(0)?.toUpperCase() +
            errorModal.error?.slice(1)}
        </span>
      </Modal>
    </div>
  );
}

export default Login;
