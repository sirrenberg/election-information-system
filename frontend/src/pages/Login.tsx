import "../styles/Login.css";
import { FormEvent, SetStateAction, useState } from "react";
import { useToken } from "../hooks/useToken";
import { useAPI } from "../hooks/useAPI";
import StyledTextField from "../components/StyledTextField";
import Button from "@mui/material/Button";
import { Credentials } from "../helper/types";
import { toast } from "react-toastify";

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const { sendRequest } = useAPI();

  const { setToken } = useToken();

  async function loginUser(credentials: Credentials) {
    sendRequest("/login", "POST", credentials).then((response) => {
      const { accessToken } = response;

      if (accessToken) {
        setToken(accessToken);
      } else {
        toast.error("Fehler beim Einloggen");
      }
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    loginUser({ id, password });
  }
  return (
    <div className="login-wrapper content-page">
      <form onSubmit={handleSubmit} className={"login-form"}>
        <h1 className="login-title">Einloggen</h1>
        <StyledTextField
          label="Wähler-ID"
          type="text"
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setId(e.target.value)
          }
          style={{ width: 500 }}
        />
        <StyledTextField
          label="Passwort"
          type="password"
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setPassword(e.target.value)
          }
          style={{ width: 500 }}
        />
        <Button type="submit" variant="contained" style={{ width: 300 }}>
          Einloggen
        </Button>
      </form>
    </div>
  );
}
