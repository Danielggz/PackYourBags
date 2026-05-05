import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    password: "",
    name: "",
    lastname: "",
    email: "",
    gender: "male",
    county: "",
    height: "",
    weight: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert height + weight to correct types
    const userData = {
      ...values,
      height: parseInt(values.height, 10),
      weight: parseFloat(values.weight)
    };

    console.log("Submitting:", userData);

    try {
        const response = await fetch("http://localhost:8080/api/users/createUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error("Registration failed");
        }

        const data = await response.json();
        console.log("Registered:", data);

        navigate("/");
    } catch (err) {
        console.error(err);
        alert("Registration failed");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={values.username}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={values.password}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="name"
          placeholder="First Name"
          value={values.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          value={values.lastname}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={values.email}
          onChange={handleChange}
          required
        />

        <select
          name="gender"
          value={values.gender}
          onChange={handleChange}
          required
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <input
          type="text"
          name="county"
          placeholder="County"
          value={values.county}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="height"
          placeholder="Height (cm)"
          value={values.height}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          step="0.1"
          name="weight"
          placeholder="Weight (kg)"
          value={values.weight}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
