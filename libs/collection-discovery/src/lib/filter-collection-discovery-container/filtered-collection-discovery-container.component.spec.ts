import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { FilteredCollectionDiscoveryContainerComponent } from './filtered-collection-discovery-container.component';
import { UmnView } from '@umn-nde/shared-state/view-config';

describe('FilteredCollectionDiscoveryContainer', () => {
  const allCollections = [
    { library: { value: 'CUMC' } },
    { library: { value: 'DUMD' } },
    { library: { value: 'MBRIG' } },
    { library: { value: 'TWILS' } },
    { library: { value: 'TSCI' } },
  ];

  async function setup(ctx: { vid: string }) {
    const vidSignal = () => ctx.vid;
    const collectionsSignal = () => allCollections;
    const mockStore = {
      selectSignal: jasmine.createSpy(),
      dispatch: jasmine.createSpy(),
    };
    mockStore.selectSignal.and.returnValues(vidSignal, collectionsSignal);
    TestBed.configureTestingModule({
      providers: [{ provide: Store, useValue: mockStore }],
    });
    const fixture = TestBed.createComponent(
      FilteredCollectionDiscoveryContainerComponent
    );
    const component = fixture.componentInstance;
    return { mockStore };
  }

  it('filters and dispatches CROOKSTON collections (starts with C)', async () => {
    const { mockStore } = await setup({ vid: UmnView.CROOKSTON });
    expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: '[Collection Discovery] Get Collections Tree Success',
        collections: allCollections.filter((c) =>
          c.library.value.startsWith('C')
        ),
      })
    );
  });

  it('filters and dispatches DULUTH collections (starts with D)', async () => {
    const { mockStore } = await setup({ vid: UmnView.DULUTH });
    expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: '[Collection Discovery] Get Collections Tree Success',
        collections: allCollections.filter((c) =>
          c.library.value.startsWith('D')
        ),
      })
    );
  });

  it('filters and dispatches MORRIS collections (starts with M)', async () => {
    const { mockStore } = await setup({ vid: UmnView.MORRIS });
    expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: '[Collection Discovery] Get Collections Tree Success',
        collections: allCollections.filter((c) =>
          c.library.value.startsWith('M')
        ),
      })
    );
  });

  it('defaults to Twin Cities filter (starts with T) for all other view codes', async () => {
    const { mockStore } = await setup({ vid: 'SOME_VIEW_CODE' });
    expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: '[Collection Discovery] Get Collections Tree Success',
        collections: allCollections.filter((c) =>
          c.library.value.startsWith('T')
        ),
      })
    );
  });
});
