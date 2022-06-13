export type AccountModel = {
  id: number;
  name: string;
  address: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  updatedBy?: number;
  expenses?: any[];
  escrows?: any[];
  loans?: any[];
  moderators?: any[];
};
