import "../styles/Vote.css";
import { useContext, useEffect, useState } from "react";
import { VoterContext } from "../contexts/VoterContext";
import Button from "@mui/material/Button";
import { useAPI } from "../hooks/useAPI";
import { Candidate } from "../helper/types";
import ConfirmVoteModal from "../components/ConfirmVoteModal";

function Vote() {
  const context = useContext(VoterContext);
  const { sendRequest } = useAPI();

  const [directCandidates, setDirectCandidates] = useState<Candidate[]>([]);
  const [listCandidates, setListCandidates] = useState<Candidate[]>([]);

  const [selectedDirectCandidateId, setSelectedDirectCandidateId] =
    useState("");
  const [selectedListCandidateId, setSelectedListCandidateId] = useState("");
  const [selectedDirectCandidateName, setSelectedDirectCandidateName] =
    useState("");
  const [selectedListCandidateName, setSelectedListCandidateName] =
    useState("");

  const [modalOpen, setModalOpen] = useState(false);

  if (!context) {
    throw new Error("useVoter must be used within a VoterProvider");
  }

  const { voter } = context;

  if (!voter) {
    return (
      <div className="content-page">
        <h1>Nicht Authorisiert</h1>
        <p>Bitte einloggen</p>

        <a href="/login">
          <Button type="button" variant="contained" style={{ width: 300 }}>
            Einloggen
          </Button>
        </a>
      </div>
    );
  }

  useEffect(() => {
    sendRequest("/candidates/stimmkreis/" + voter.stimmkreis.id, "GET").then(
      (data) => {
        data["directCandidates"] &&
          setDirectCandidates(data["directCandidates"]);
        data["listCandidates"] && setListCandidates(data["listCandidates"]);
      }
    );
  }, []);

  function groupByParty(candidates: Candidate[]) {
    const groupByParty = candidates.reduce(
      (
        acc: {
          [partei: string]: Candidate[];
        },
        candidate
      ) => {
        if (!acc[candidate.parteiname]) {
          acc[candidate.parteiname] = [];
        }
        acc[candidate.parteiname].push(candidate);
        return acc;
      },
      {}
    );

    // push candidates with negative id to the end of the array
    Object.keys(groupByParty).forEach((partei) => {
      groupByParty[partei].sort((a, b) => {
        if (Number(a.kandidatenid) < 0) {
          return 1;
        }
        if (Number(b.kandidatenid) < 0) {
          return -1;
        }
        return 0;
      });
    });

    return groupByParty;
  }

  return (
    <div className="vote-page-container content-page">
      <h1 className="page-title">
        Stimmzettel zur Landtagswahl am 8. Oktober 2023
      </h1>
      <div className="voter-info">
        <h2>
          Stimmkreis: {voter.stimmkreis.id} - {voter.stimmkreis.name}
        </h2>
        <h2>
          Wahlkreis: {voter.wahlkreis.id} - {voter.wahlkreis.name}
        </h2>
        <p>Wähler: {voter.first_name + " " + voter.last_name}</p>
      </div>

      <div className="votes-container">
        <h2>
          A. Erststimme für die Wahl einer oder eines Stimmkreisabgeordeten
        </h2>
        <p>Sie haben eine Stimme</p>
        <div className="first-vote-buttons">
          <div className="radio-button-group">
            {directCandidates.map((candidate) => {
              const candidateName =
                candidate.kandidatennamen +
                " (" +
                candidate.kurzbezeichnung +
                ")";

              return (
                <div key={candidate.kandidatenid} className="input-container">
                  <input
                    type="radio"
                    id={candidate.kandidatenid}
                    name="directCandidate"
                    value={candidate.kandidatenid}
                    onChange={(e) => {
                      setSelectedDirectCandidateName(candidateName);
                      setSelectedDirectCandidateId(e.target.value);
                    }}
                  />
                  <label htmlFor={candidate.kandidatenid}>
                    {candidateName}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="votes-container">
        <h2>B. Zweitstimme für die Wahl einer Landesliste einer Partei</h2>
        <p>Sie haben eine Stimme</p>

        <div className="radio-buttons-container">
          {Object.entries(groupByParty(listCandidates)).map(
            ([partei, candidates]) => {
              return (
                <div key={partei} className="radio-button-group">
                  <h3 className="party-title">{partei}</h3>
                  {candidates.map((candidate) => {
                    const candidateName =
                      candidate.kandidatennamen +
                      " (" +
                      candidate.kurzbezeichnung +
                      ")";
                    return (
                      <div
                        key={candidate.kandidatenid}
                        className="input-container"
                      >
                        <input
                          type="radio"
                          id={candidate.kandidatenid}
                          name="listCandidate"
                          value={candidate.kandidatenid}
                          onChange={(e) => {
                            setSelectedListCandidateName(candidateName);
                            setSelectedListCandidateId(e.target.value);
                          }}
                        />
                        <label htmlFor={candidate.kandidatenid}>
                          {candidateName}
                        </label>
                      </div>
                    );
                  })}
                </div>
              );
            }
          )}
        </div>
      </div>

      <div className="buttons-container">
        <Button
          type="button"
          variant="contained"
          style={{ width: 300 }}
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Stimmzettel abgeben
        </Button>
      </div>

      {modalOpen && (
        <ConfirmVoteModal
          voter={voter}
          selectedDirectCandidateName={selectedDirectCandidateName}
          selectedListCandidateName={selectedListCandidateName}
          setModalOpen={setModalOpen}
          selectedDirectCandidateId={selectedDirectCandidateId}
          selectedListCandidateId={selectedListCandidateId}
        />
      )}
    </div>
  );
}

export default Vote;
