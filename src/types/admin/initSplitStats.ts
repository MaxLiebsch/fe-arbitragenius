export type SplitStats = {
  [key: number]: {
    total: number;
    tasks: { completedAt: string; id: string; shopDomain: string }[];
  };
};
