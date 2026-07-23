import { articlePageUrl, requestPageUrl } from './illiad-url.utils';
import { IlliadTransaction, NormalizedIllTransaction } from './illiad.types';

export function normalizeRequestTransactions(
  transactions: IlliadTransaction[],
): NormalizedIllTransaction[] {
  return transactions.map((txn) => ({
    txnNum: txn.TransactionNumber,
    title: txn.PhotoArticleTitle || txn.LoanTitle,
    author: txn.PhotoArticleAuthor || txn.LoanAuthor,
    url: requestPageUrl(txn.TransactionNumber),
  }));
}

export function normalizeArticleTransactions(
  transactions: IlliadTransaction[],
): NormalizedIllTransaction[] {
  return transactions.map((txn) => ({
    txnNum: txn.TransactionNumber,
    title: txn.PhotoArticleTitle,
    author: txn.PhotoArticleAuthor,
    url: articlePageUrl(txn.TransactionNumber),
  }));
}
