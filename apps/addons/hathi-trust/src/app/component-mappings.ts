import type { Type } from '@angular/core';
import { HathiTrustComponent } from '@umn-nde/hathi-truse';

type NdeSelector = `nde-${string}`;

export const selectorComponentMap = new Map<NdeSelector, Type<object>>([
  ['nde-online-availability-before', HathiTrustComponent],
]);
