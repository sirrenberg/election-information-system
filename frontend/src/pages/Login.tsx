import "../styles/Login.css";
import { FormEvent, SetStateAction, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { useAPI } from "../hooks/useAPI";
import StyledTextField from "../components/StyledTextField";
import Button from "@mui/material/Button";
import { Credentials } from "../helper/types";
import { toast } from "react-toastify";
import { VoterContext } from "../contexts/VoterContext";

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const { sendRequest, delay } = useAPI();
  const navigate = useNavigate();
  const context = useContext(VoterContext);

  if (!context) {
    throw new Error("useVoter must be used within a VoterProvider");
  }

  const { setVoter } = context;

  function loginUser(credentials: Credentials) {
    sendRequest("/login", "POST", credentials).then((response) => {
      const { accessToken, voter } = response;

      const timer = 2000;

      if (accessToken) {
        const voter_to_add = {
          id: voter.id,
          first_name: voter.first_name,
          last_name: voter.last_name,
          stimmkreis: {
            id: voter.stimmkreis.id,
            name: voter.stimmkreis.name,
          },
          wahlkreis: {
            id: voter.wahlkreis.id,
            name: voter.wahlkreis.name,
          },
          token: accessToken,
        };

        setVoter(voter_to_add);

        toast.success("Erfolgreich eingeloggt", {
          autoClose: timer,
        });

        delay(timer).then(() => navigate("/vote"));
      } else {
        toast.error("Fehler beim Einloggen", {
          autoClose: timer,
        });
      }
    });
  }

  function handleSubmit(e: FormEvent) {
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
