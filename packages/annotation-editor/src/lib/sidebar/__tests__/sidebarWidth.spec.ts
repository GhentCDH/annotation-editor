import { clampSidebarWidth } from '../sidebarWidth';

describe('clampSidebarWidth', () => {
  it.each`
    width   | viewport | expected
    ${400}  | ${1500}  | ${400}
    ${100}  | ${1500}  | ${240}
    ${1400} | ${1500}  | ${1200}
    ${500}  | ${200}   | ${240}
    ${333.4}| ${1500}  | ${333}
  `('clamps $width at viewport $viewport to $expected', ({ width, viewport, expected }) => {
    expect(clampSidebarWidth(width, viewport)).toBe(expected);
  });
});
