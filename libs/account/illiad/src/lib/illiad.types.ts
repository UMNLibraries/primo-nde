export interface IlliadTransaction {
  TransactionNumber: number;
  PhotoArticleTitle?: string;
  PhotoArticleAuthor?: string;
  LoanTitle?: string;
  LoanAuthor?: string;
}

export type IlliadApiResponse = Array<IlliadTransaction>;

export interface NormalizedIllTransaction {
  txnNum: number;
  url: string;
  title?: string;
  author?: string;
}
