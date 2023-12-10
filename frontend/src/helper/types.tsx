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

export type {
  chartData,
  chartOptions,
  menuEntry,
  stimmkreis,
  seatData,
  candidateData,
};
