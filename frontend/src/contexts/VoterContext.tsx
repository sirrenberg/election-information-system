import { useState, createContext, ReactNode } from "react";
import { Voter } from "../helper/types";

interface IVoterContext {
  voter: Voter | null;
  setVoter: (voter: Voter | null) => void;
}

const VoterContext = createContext<IVoterContext | undefined>(undefined);

function ContextProvider({ children }: { children: ReactNode }) {
  const [voter, setVoter] = useState<Voter | null>(null);

  return (
    <VoterContext.Provider value={{ voter, setVoter }}>
      {children}
    </VoterContext.Provider>
  );
}

export { ContextProvider as VoterContextProvider, VoterContext };
