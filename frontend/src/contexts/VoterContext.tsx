import { useState, createContext, ReactNode } from "react";
import { Voter } from "../helper/types";

const VoterContext = createContext<any>(null);

function ContextProvider({ children }: { children: ReactNode }) {
  const [voter, setVoter] = useState<Voter | null>(null);

  return (
    <VoterContext.Provider value={{ voter, setVoter }}>
      {children}
    </VoterContext.Provider>
  );
}

export { ContextProvider as VoterContextProvider, VoterContext };
