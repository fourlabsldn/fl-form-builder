/* eslint-disable global-require */

/**
 *
 *  This module allows you to test that React components are being rendered
 *  appropriately.
 *
 * A JSON image of the rendered component is saved in a file with the same name
 * as the test file being used, but with the extension `snapshots.json`.
 *
 * USAGE:
 *    Instantiate it with the test mode. If you want to set the JSON images
 *    to be used, use `SET`, if you want to check if the images are correct
 *    use `CHECK`. You can force the mode on `matchesSnapshot` calls.
 *
 *      const shots = new UiSnapshots('CHECK');
 *
 *    When testing your components just call `matchesSnapshot`. It will compare
 *    the sent component with the one registered in the JSON file.
 *    Order matters.
 *    The first component set will be checked agains the first component tested.
 *
 *
 *      const myElement = renderer.create(React.createElement(MyElement));
 *      shots.matchesSnapshot(myElement);
 */
// =============================================================================

const fs = require('fs');
const path = require('path');
const colors = require('colors');
const jsdiff = require('diff');
const assert = (invariant, err) => {
  if (!invariant) {
    throw new Error(err);
  }
};

const logDifference = (one, other) => {
  const diff = jsdiff.diffJson(one, other);

  diff.forEach((part) => {
    // green for additions, red for deletions
    // grey for common parts
    let color;
    if (part.added) {
      color = 'green';
    } else if (part.removed) {
      color = 'red';
    } else {
      color = 'grey';
    }

    process.stderr.write(colors[color](part.value));
  });

  console.log();
};




// ========================= GET INVOKING FILE =================================

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
    const file = fs.readFileSync(snapshotsFileAddress());
    return JSON.parse(file.toString());
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
    SET: 'SET',
    CHECK: 'CHECK',
  },
};


// =============================================================================


module.exports = class UiSnapshots {
  constructor(mode) {
    assert(GLOBAL.MODES[mode], `Invalid mode in constructor: ${mode}`);
    this.mode = GLOBAL.MODES[mode];

    // If it is an update, then let's remove all previous snapshots
    if (this.mode === GLOBAL.MODES.SET) {
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

    if (mode === GLOBAL.MODES.SET) {
      setSnapshot(shot, shotId);
      return true;
    }

    if (mode === GLOBAL.MODES.CHECK) {
      const snapshots = getSnapshots();
      assert(snapshots[shotId], `No snapshot registered for ${shotId}`);

      const saved = JSON.stringify(snapshots[shotId], null, 2);
      const beingChecked = JSON.stringify(shot, null, 2);

      if (saved !== beingChecked) {
        console.log(colors.white('Differences found between snapshots:'));
        logDifference(saved, beingChecked);
        return false;
      }
      return true;
    }

    assert(false, `Invalid mode: ${mode}.`);
    return false;
  }
};
