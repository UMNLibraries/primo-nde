export const UmnView = {
  CROOKSTON: '01UMN_INST:C',
  DULUTH: '01UMN_INST:D',
  MORRIS: '01UMN_INST:M',
  TWINCITIES: '01UMN_INST:T',
} as const;

export type UmnViewCode = (typeof UmnView)[keyof typeof UmnView];
