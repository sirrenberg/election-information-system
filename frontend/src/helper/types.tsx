type chartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
  }[];
};

type chartOptions = {
  responsive: boolean;
  maintainAspectRatio: boolean;
};

type stimmkreis = {
  id: number;
  name: string;
};

type menuEntry = {
  title: string;
  main_link: string;
  sublist: {
    name: string;
    link: string;
  }[];
};

type seatData = {
  party: string;
  seats: number;
  color: string;
  votes: number;
};

type candidateData = {
  party: string;
  wahlkreis: string;
  name: string;
  stimmkreis: string;
};

type ueberhangData = {
  wahlkreis: string;
  partei: string;
  direktmandate: number;
  ueberhangmandate: number;
  totalmandate: number;
};

type knappsteSiegerData = {
  partei: string;
  parteiLong: string;
  stimmkreis: string;
  differenz: number;
  sieger: string;
  verlierer: string;
  tag: string;
};

type stimmkreisuebersicht ={
  beteiligung: number,
  kandidatenname: string,
  kurzbezeichnung: string,
  anzahlStimmenFürKandidat: number,
  anzahlWaehlerStimmkreis: number,
  anzahlStimmberechtigteStimmkreis: number,
  stimmkreisname: string,
  diffBeteiligung: number,
  letzterDirektkandidat: string,
  parteiLetzterDirektkandidat: string,
  diffStimmen: number,
  diffWaehler: number,
  diffStimmberechtigte: number,
};

type stimmkreisParteiErgebnis = {
  parteiname: string,
  kurzbezeichnung: string,
  anzahlStimmen: number,
  anzahlStimmenRelativ: number,
  parteiFarbe: string,
  diffstimmenabsolut: string,
  diffstimmenrel: string,
};

type Credentials = {
  id: string;
  password: string;
};

type Voter = {
  id: string;
  first_name: string;
  last_name: string;
  stimmkreis: {
    id: string;
    name: string;
  };
  wahlkreis: {
    id: string;
    name: string;
  };
  token: string;
};

type Candidate = {
  kandidatenid: string;
  kandidatennamen: string;
  parteiid: string;
  parteiname: string;
  kurzbezeichnung: string;
  farbe: string;
};

type stimmkreisSieger = {
  erststimmensieger: string,
  erststimmensiegerstimmen: number,
  zweitstimmensieger: string,
  zweitstimmensiegerstimmen: number,
  gesamtstimmensieger: string,
  gesamtstimmensiegerstimmen: number,
};

type stimmen = {
  parteiname: string,
  anzahlStimmen: number,
  parteiFarbe: string,
};

export type {
  chartData,
  chartOptions,
  menuEntry,
  stimmkreis,
  seatData,
  candidateData,
  ueberhangData,
  knappsteSiegerData,
  stimmkreisuebersicht,
  stimmkreisParteiErgebnis,
  Credentials,
  Voter,
  Candidate,
  stimmkreisSieger,
  stimmen,
};
