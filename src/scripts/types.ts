export type BlockSite = {
  domain: string;
  path: string;
};

// Needs to be string type for browser storage
export type Session = {
  start: string;
  end: string;
  repeat: string;
  exceptions: string[];
  name: string;
  deck: string;
};
