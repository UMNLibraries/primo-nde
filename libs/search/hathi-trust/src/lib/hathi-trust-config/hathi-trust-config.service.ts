import { Inject, Injectable } from '@angular/core';

type booleanOption = boolean | 'true' | 'false';

interface HathiTrustModuleParameters {
  disableWhenAvailableOnline: booleanOption;
  disableForJournals: booleanOption;
  ignoreCopyright: booleanOption;
  matchOn: {
    oclc: booleanOption;
    isbn: booleanOption;
    issn: booleanOption;
    lccn: booleanOption;
  };
}

@Injectable({
  providedIn: 'root',
})
export class HathiTrustConfigService {
  constructor(
    @Inject('MODULE_PARAMETERS')
    private moduleParameters: HathiTrustModuleParameters,
  ) {
    console.debug(
      'HathiTrustConfigService initialized with parameters: ',
      moduleParameters,
    );
  }

  get disableWhenAvailableOnline(): boolean {
    return this.parseBooleanOption(
      this.moduleParameters.disableWhenAvailableOnline,
      true,
    );
  }

  get disableForJournals(): boolean {
    return this.parseBooleanOption(
      this.moduleParameters.disableForJournals,
      false,
    );
  }

  get ignoreCopyright(): boolean {
    return this.parseBooleanOption(
      this.moduleParameters.ignoreCopyright,
      false,
    );
  }

  get matchOnOclc(): boolean {
    return this.parseBooleanOption(this.moduleParameters.matchOn?.oclc, true);
  }

  get matchOnIsbn(): boolean {
    return this.parseBooleanOption(this.moduleParameters.matchOn?.isbn, false);
  }

  get matchOnIssn(): boolean {
    return this.parseBooleanOption(this.moduleParameters.matchOn?.issn, false);
  }

  get matchOnLccn(): boolean {
    return this.parseBooleanOption(this.moduleParameters.matchOn?.lccn, false);
  }

  private parseBooleanOption(
    value: booleanOption,
    defaultValue: boolean,
  ): boolean {
    if (value === undefined || value === null) return defaultValue;
    if (typeof value === 'boolean') return value;
    return value === 'true';
  }
}
