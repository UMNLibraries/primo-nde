// collection-discovery.selectors.spec.ts
import { selectCollectionsTreeForView } from './collection-discovery.selectors';
import { UmnView } from '../view-config/umn-view.types';

describe('CollectionDiscovery Selectors', () => {
  // no need to test every possible library...
  const allCollections = [
    { library: { value: 'CUMC' } },
    { library: { value: 'DUMD' } },
    { library: { value: 'MBRIG' } },
    { library: { value: 'TWILS' } },
    { library: { value: 'TSCI' } },
  ];

  it(`should filter out non-Crookston libraries when vid is ${UmnView.CROOKSTON}`, () => {
    const result = selectCollectionsTreeForView.projector(
      allCollections,
      UmnView.CROOKSTON
    );
    expect(result).toHaveLength(1);
    expect(result[0].library.value).toBe('CUMC');
  });

  it(`should filter out non-Duluth libraries when vid is ${UmnView.DULUTH}`, () => {
    const result = selectCollectionsTreeForView.projector(
      allCollections,
      UmnView.DULUTH
    );
    expect(result).toHaveLength(1);
    expect(result[0].library.value).toBe('DUMD');
  });

  it(`should filter out non-Morris libraries when vid is ${UmnView.MORRIS}`, () => {
    const result = selectCollectionsTreeForView.projector(
      allCollections,
      UmnView.MORRIS
    );
    expect(result).toHaveLength(1);
    expect(result[0].library.value).toBe('MBRIG');
  });

  it(`should filter out non-Twin Cities libraries when vid is ${UmnView.TWINCITIES}`, () => {
    const result = selectCollectionsTreeForView.projector(
      allCollections,
      UmnView.TWINCITIES
    );
    expect(result).toHaveLength(2);
    expect(result[0].library.value).toBe('TWILS');
    expect(result[1].library.value).toBe('TSCI');
  });
});
