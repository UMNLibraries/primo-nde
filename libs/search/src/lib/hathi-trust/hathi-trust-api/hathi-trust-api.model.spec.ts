import { HathiTrustQuery, HathiTrustResponse } from './hathi-trust-api.model';

describe('HathiTrustQuery', () => {
  it('throws if constructed with no identifiers', () => {
    expect(() => new HathiTrustQuery({})).toThrowError(
      /HathiTrustQuery must have at least one of the following/
    );
  });

  it('builds string for a single id type', () => {
    const q = new HathiTrustQuery({ oclc: ['123', '456'] });
    expect(q.toString()).toBe('oclc:123;oclc:456');
  });

  it('builds string for multiple id types preserving provided order', () => {
    const q = new HathiTrustQuery({
      isbn: ['9781111111111'],
      issn: ['2049-3630'],
    });
    expect(q.toString()).toBe('isbn:9781111111111;issn:2049-3630');
  });
});

describe('HathiTrustResponse', () => {
  const recordA = {
    recordURL: 'https://hathitrust.org/recordA',
    titles: ['Title A'],
    isbns: ['9780000000001'],
    issns: [],
    oclcs: [],
    lccns: [],
  };

  const recordB = {
    recordURL: 'https://hathitrust.org/recordB',
    titles: ['Title B'],
    isbns: [],
    issns: [],
    oclcs: [],
    lccns: [],
  };

  it('can find a full view item', () => {
    const raw = {
      records: { a: recordA, b: recordB },
      items: [
        {
          orig: 'orig1',
          fromRecord: 'a',
          htid: 'htid1',
          itemURL: 'https://item/1',
          rightsCode: 'pd',
          lastUpdate: '2020',
          enumcron: '',
          usRightsString: 'Full View',
        },
        {
          orig: 'orig2',
          fromRecord: 'b',
          htid: 'htid2',
          itemURL: 'https://item/2',
          rightsCode: 'ic',
          lastUpdate: '2021',
          enumcron: '',
          usRightsString: 'Limited (search-only)',
        },
      ],
    };
    const resp = HathiTrustResponse.of(raw as any);
    expect(resp.findFullViewUrl()).toBe('https://hathitrust.org/recordA');
  });

  it('returns undefined when no full view item and ignoreCopyright is false', () => {
    const raw = {
      records: { a: recordA },
      items: [
        {
          orig: 'orig1',
          fromRecord: 'a',
          htid: 'htid1',
          itemURL: 'https://item/1',
          rightsCode: 'ic',
          lastUpdate: '2020',
          enumcron: '',
          usRightsString: 'LimLimited (search-only)',
        },
      ],
    };
    const resp = HathiTrustResponse.of(raw as any);
    expect(resp.findFullViewUrl()).toBeUndefined();
  });

  it('returns the first item record URL when ignoreCopyright is true', () => {
    const raw = {
      records: { a: recordA, b: recordB },
      items: [
        {
          orig: 'orig1',
          fromRecord: 'b',
          htid: 'htid1',
          itemURL: 'https://item/1',
          rightsCode: 'ic',
          lastUpdate: '2020',
          enumcron: '',
          usRightsString: 'Limited (search-only)',
        },
      ],
    };
    const resp = HathiTrustResponse.of(raw as any);
    expect(resp.findFullViewUrl({ ignoreCopyright: true })).toBe(
      'https://hathitrust.org/recordB'
    );
  });

  it('returns undefined when items array is empty', () => {
    const raw = {
      records: {},
      items: [],
    };
    const resp = HathiTrustResponse.of(raw as any);
    expect(resp.findFullViewUrl()).toBeUndefined();
  });
});
