/* eslint-disable global-require */
const fs = require('fs');
const path = require('path');
const assert = (invariant, err) => {
  if (!invariant) {
    throw new Error(err);
  }
};

// =================== GET INVOKING FILE ====================== //

// Impure
// File that invoked this script right now
const invokingFilePath = () => {
  const originalFunc = Error.prepareStackTrace;
  let filename;
  try {
    const err = new Error();

    Error.prepareStackTrace = (e, stack) => stack;
    const currentFile = err.stack[0].getFileName();

    let callerFile;
    let needle = 0;
    while (err.stack[needle]) {
      callerFile = err.stack[needle].getFileName();
      if (callerFile !== currentFile) {
        filename = callerFile;
        break;
      }
      needle++;
    }
  } catch (err) {
    throw new Error('Error getting task file name');
  }

  Error.prepareStackTrace = originalFunc;
  return filename;
};

// Return info about file that last invoked a function from this file
const getInvokingFile = () => {
  const address = invokingFilePath();
  const { name, dir } = path.parse(address);
  return {
    address,
    dir,
    name,
  };
};

// =============================  SNAPSHOT  ====================================

const snapshotsFileName = () => {
  return `${getInvokingFile().name}.snapshots.json`;
};

const snapshotsFileAddress = () => {
  return path.join(getInvokingFile().dir, snapshotsFileName());
};

const setSnapshotsFileContent = (content) => {
  try {
    fs.writeFileSync(
      snapshotsFileAddress(),
      JSON.stringify(content, null, '\t')
    );
  } catch (e) {
    // do nothing
  }
};

// Returns the content of the snapshots file for the specific
// invoking file
const getSnapshots = () => {
  try {
    return require(snapshotsFileAddress());
  } catch (e) {
    return {};
  }
};

// Sets the content of the snapshots file for the specific
// invoking file.
const setSnapshot = (shot, shotId) => {
  const newSnapshot = Object.assign({}, getSnapshots(), { [shotId]: shot });
  setSnapshotsFileContent(newSnapshot);
};

// =============================================================================

const GLOBAL = {
  MODES: {
    UPDATE: 'UPDATE',
    CHECK: 'CHECK',
  },
};


// =============================================================================


module.exports = class UiSnapshots {
  constructor(mode) {
    assert(GLOBAL.MODES[mode], `Invalid mode in constructor: ${mode}`);
    this.mode = GLOBAL.MODES[mode];

    // If it is an update, then let's remove all previous snapshots
    if (this.mode === GLOBAL.MODES.UPDATE) {
      setSnapshotsFileContent({});
    }

    // Shots are registered in the order they appear in the
    // test file
    this.shotId = 0;
    Object.preventExtensions(this);
  }

  increaseShotId() {
    this.shotId = this.shotId + 1;
  }

  matchesSnapshot(shot, forceMode) {
    const mode = forceMode || this.mode;
    const shotId = this.shotId;
    assert(GLOBAL.MODES[mode], `Invalid mode set ${mode}`);

    this.increaseShotId();

    if (mode === GLOBAL.MODES.UPDATE) {
      setSnapshot(shot, shotId);
      return true;
    }

    if (mode === GLOBAL.MODES.CHECK) {
      const snapshots = getSnapshots();
      assert(snapshots[shotId], `No snapshot registered for ${shotId}`);
      return JSON.stringify(snapshots[shotId]) === JSON.stringify(shot);
    }

    assert(false, `Invalid mode: ${mode}.`);
    return false;
  }
};
