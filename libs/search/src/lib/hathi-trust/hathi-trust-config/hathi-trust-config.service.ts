import { Inject, inject, Injectable } from "@angular/core";

interface HathiTrustModuleParameters {
  disableWhenAvailableOnline: boolean;
  disableForJournals: boolean;
  ignoreCopyright: boolean;
  matchOn: {
    oclc: boolean;
    isbn: boolean;
    issn: boolean;
  };
}

@Injectable({
  providedIn: "root",
})
export class HathiTrustConfigService {
  constructor(
    @Inject("MODULE_PARAMETERS")
    private moduleParameters: HathiTrustModuleParameters
  ) {}

  get disableWhenAvailableOnline(): boolean {
    return this.moduleParameters.disableWhenAvailableOnline ?? true;
  }

  get disableForJournals(): boolean {
    return this.moduleParameters.disableForJournals ?? false;
  }

  get ignoreCopyright(): boolean {
    return this.moduleParameters.ignoreCopyright ?? false;
  }

  get matchOnOclc(): boolean {
    return this.moduleParameters.matchOn?.oclc ?? true;
  }

  get matchOnIsbn(): boolean {
    return this.moduleParameters.matchOn?.isbn ?? false;
  }

  get matchOnIssn(): boolean {
    return this.moduleParameters.matchOn?.issn ?? false;
  }
}
