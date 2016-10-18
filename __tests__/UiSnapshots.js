/* eslint-disable global-require */
const fs = require('fs');
const assert = require('fl-assert');
const snapshotsFileName = 'uiSnapshots.json';

const GLOBAL = {
  snapshots: fs.readdirSync('./').includes('uiSnapshots.json')
    ? require(snapshotsFileName)
    : {},
};

const MODES = {
  update: 'update',
  check: 'check',
};

// =================================

const setSnapshot = (shot, shotId, snaps) => {
  return Object.assign({}, snaps, { [shotId]: shot });
};

class UiSnapshots {
  constructor(mode) {
    assert(MODES[mode]);

    this.state = {
      mode: MODES[mode],
    };
  }

  matchesSnapshot(rawShot, matchingShotId, mode = this.state.mode) {
    assert(MODES[mode], `Invalid mode set ${mode}`);
    const shot = typeof rawShot === 'string' ? rawShot : JSON.stringify(rawShot);

    if (mode === MODES.update) {
      GLOBAL.snapshots = setSnapshot(shot, matchingShotId, GLOBAL.snapshots);
      return true;
    }

    if (mode === MODES.check) {
      assert(GLOBAL.snapshots[matchingShotId], `No snapshot registered for ${matchingShotId}`);
      return GLOBAL.snapshots[matchingShotId] === shot;
    }

    assert(false, `Invalid mode: ${mode}.`);
    return false;
  }

  finish() {
    fs.writeFileSync(snapshotsFileName, JSON.stringify(GLOBAL.snapshots));
  }
}

export default UiSnapshots;
