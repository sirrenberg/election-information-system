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

export type { chartData, chartOptions };
