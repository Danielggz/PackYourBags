import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"

export default function Login() {
  const [email, setEmail] = useState("test@gmail.com"); //default email
  const [password, setPassword] = useState("Abc123."); //default password
  const [error, setError] = useState("");
  const navigate = useNavigate();

   async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      //Connect with backend
      const res = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", //Session
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        //Store response in user
        const user = await res.json();
        console.log("Logged in:", user);
        navigate("/selectActivity")
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Server error");
    }
  }

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
                <input className="form-control" id="inputEmail" type="text" value={email} name="email" onChange={(e) => setEmail(e.target.value)} required/>
              </div>
              <br />
              <div>
                <input className="form-control" id="inputPwd" type="password" value={password} name="pwd" onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <br />
              <button className="btn btn-primary" type="submit"> Login </button>
              {error && (<div className="alert alert-danger mt-3" role="alert"> {error}</div>)}
            </form>

            <br />
            If you are not registered, sign up <a href="/register">here</a>
          </div>
        </div>
      </div>
    </div>
  );
}