export interface Above {
  above: number;
  percentage: number;
}
export interface UpTo {
  up_to: number;
  percentage: number;
}

export interface Tier {
  no_shop: (Above | UpTo)[];
  shop: (Above | UpTo)[];
}
export interface EbyTierCategory {
  id: number;
  category: string;
  tier: Tier;
}
