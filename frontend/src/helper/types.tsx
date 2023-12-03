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
  sublist: string[];
};

export type { chartData, chartOptions, menuEntry, stimmkreis };
