const chai = require('chai');
const {expect} = chai;
const fs = require('mz/fs');
const path = require('path');

const WithTempDir = require(path.join(__dirname, 'index.js')).WithTempDir;

describe('WithTempDir', () => {
    it('should create a writable tmp direcotry', async function () {
        let savedTmpdir = null;
        await WithTempDir(async function (tmpdir) {
            savedTmpdir = tmpdir;
            // Tmp dir should exist
            const exists = await fs.exists(tmpdir);
            expect(exists).to.be.true;
            // try to write test file and read it back
            const testfile = path.join(tmpdir, 'test.txt');
            await fs.writeFile(testfile, 'foobar', 'utf8');
            const txt = await fs.readFile(testfile, 'utf8');
            expect(txt).to.equal('foobar');
        });
        // Tmp dir should not exist anymore
        const exists = await fs.exists(savedTmpdir);
        expect(exists).to.be.false;
    });
});
