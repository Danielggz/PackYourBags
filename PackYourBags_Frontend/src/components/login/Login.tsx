import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("user@fakemail.com");
  const [password, setPassword] = useState("abc123.");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Fake login check
    if (email === "user@fakemail.com" && password === "abc123.") {
      navigate("/selectActivity");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="loginPage">
      <div className="container">
        <div className="title">
          <h2>Be Ready to Explore</h2>
        </div>

        <div className="loginBox">
          <div className="container title">
            <form className="form" id="formLogin" onSubmit={handleSubmit}>
              <div>
                <input
                  className="form-control"
                  id="inputEmail"
                  type="text"
                  value={email}
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <br />

              <div>
                <input
                  className="form-control"
                  id="inputPwd"
                  type="password"
                  value={password}
                  name="pwd"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <br />

              <button className="btn btn-primary" type="submit">
                Login
              </button>
            </form>

            <br />
            If you are not registered, sign up <a href="#">here</a>
          </div>
        </div>
      </div>
    </div>
  );
}