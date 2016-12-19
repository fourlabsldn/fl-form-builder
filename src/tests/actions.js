/* eslint-env jasmine */

import { undo } from '../js/Actions';
const prefix = 'FBUILDER_';

describe('Action', () => {
  describe('undo', () => {
    it('returns the correct action type', () => {
      const action = undo();
      expect(action.type).toEqual(`${prefix}undo`);
    });
  });
});
