export interface MSAData {
  msa: string;
  msa_name: string;
  EMP?: number;
  PAYANN?: number;
  ESTAB?: number;
  B01001_001E?: number;
  B19013_001E?: number;
  B23025_004E?: number;
}

export interface MapColors {
  primary: string;
  secondary: string;
  accent: string;
  highlight: string;
  active: string;
  inactive: string;
  disabled: string;
}