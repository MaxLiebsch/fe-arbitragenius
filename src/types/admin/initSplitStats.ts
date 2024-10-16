export type SplitStats = {
  [key: string]: {
    total: number;
    tasks: {
      completedAt: string;
      executing: boolean;
      id: string;
      shopDomain: string;
      lastCrawler: string[]
      lastTotal: number;
      estimatedProducts: number;
      productLimit: number;
    }[];
  };
};
