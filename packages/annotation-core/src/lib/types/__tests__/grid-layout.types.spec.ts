import {
  type GridLayout,
  buildGridStyle,
  getPaneArea,
} from '../grid-layout.types';

const layout: GridLayout = {
  areas: [
    ['original', 'translation'],
    ['commentary', 'commentary'],
  ],
  panes: [
    { sourceId: 'src-1', area: 'original' },
    { sourceId: 'src-2', area: 'translation' },
  ],
};

describe('buildGridStyle', () => {
  it('builds template areas and equal columns by default', () => {
    expect(buildGridStyle(layout)).toEqual({
      gridTemplateAreas: '"original translation" "commentary commentary"',
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
    });
  });

  it('uses explicit columns and rows', () => {
    expect(
      buildGridStyle({ ...layout, columns: '2fr 1fr', rows: 'auto 1fr' }),
    ).toMatchObject({
      gridTemplateColumns: '2fr 1fr',
      gridTemplateRows: 'auto 1fr',
    });
  });
});

describe('getPaneArea', () => {
  it.each`
    sourceId     | area
    ${'src-1'}   | ${'original'}
    ${'src-2'}   | ${'translation'}
    ${'missing'} | ${undefined}
  `('maps $sourceId to $area', ({ sourceId, area }) => {
    expect(getPaneArea(layout, sourceId)).toBe(area);
  });
});
