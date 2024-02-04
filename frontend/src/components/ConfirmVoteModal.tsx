import "../styles/Modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import Button from "@mui/material/Button";
import { useAPI } from "../hooks/useAPI";
import { Voter } from "../helper/types";
import { VoterContext } from "../contexts/VoterContext";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

// Modal Window for showing data sources
function ConfirmVoteModal({
  setModalOpen,
  voter,
  selectedDirectCandidateId,
  selectedListCandidateId,
  selectedDirectCandidateName,
  selectedListCandidateName,
}: {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  voter: Voter;
  selectedDirectCandidateId: string;
  selectedListCandidateId: string;
  selectedDirectCandidateName: string;
  selectedListCandidateName: string;
}) {
  const { sendRequest } = useAPI();
  const context = useContext(VoterContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error("useVoter must be used within a VoterProvider");
  }

  const { setVoter } = context;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Stimmzettel</h2>
        <FontAwesomeIcon
          className="modal-close-icon"
          icon={faX}
          onClick={() => {
            setModalOpen(false);
          }}
        />

        <div className="modal-content">
          <div className="modal-section">
            <h3 className="modal-section-title">
              Gewählte/r Direktkandidat/in
            </h3>
            <p>
              {selectedDirectCandidateName === ""
                ? "Kein Direktkandidat gewählt"
                : selectedDirectCandidateName}
            </p>
          </div>
          <div className="modal-section">
            <h3 className="modal-section-title">
              Gewählte/r Listenkandidat/in
            </h3>
            <p>
              {selectedListCandidateName === ""
                ? "Kein Listenkandidat gewählt"
                : selectedListCandidateName}
            </p>
          </div>
          <div className="modal-section">
            <h3 className="modal-section-title">
              Sind Sie Sich mit Ihrer Wahl Sicher?
            </h3>
            <p>
              Sie können Ihre Wahl nicht mehr ändern, sobald Sie den Stimmzettel
              abgegeben haben.
            </p>

            <Button
              type="button"
              variant="contained"
              style={{ width: 300 }}
              onClick={() => {
                sendRequest(
                  "/vote",
                  "POST",
                  {
                    voterId: voter.id,
                    stimmkreisid: voter.stimmkreis.id,
                    selectedDirectCandidateId,
                    selectedListCandidateId,
                  },
                  voter.token
                )
                  .then(() => {
                    toast.success("Stimmzettel erfolgreich abgegeben", {
                      autoClose: 5000,
                    });
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                    toast.error("Fehler beim Abgeben des Stimmzettels", {
                      autoClose: 5000,
                    });
                  });

                setVoter(null);
                setModalOpen(false);
                navigate("/login");
              }}
            >
              Stimmzettel abgeben
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmVoteModal;
