import { useState } from "react";

const Register = ({ onRegister, goTologin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const handleRegister = async () => {
    try {
      await fetch(
        "http://localhost:3000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const loginRes = await fetch(
        "http://localhost:3000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await loginRes.json();

      localStorage.setItem(
        "token",
        data.access_token
      );

      onRegister();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button onClick={handleRegister}>
        Register
      </button>
      <p>already have an account?
        <button onClick={goTologin}>login</button>
      </p>
    </div>
  );
};

export default Register;