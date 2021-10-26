const tmp = require('tmp');

/**
 * Run the given callback with a newly created temporary directory,
 * automatically cleaning up once the promise
 * This function returns a promise that resolves of rejects depending on
 * A failure in creating the temporary directory causes
 * immediate rejection without calling the callback.
 * @param {*} callback A function(tmpPath) retuning a promise
 * @param {*} opts Options for the tmp library. Default: Also delete files in the directory.
 * Also supports cleanupAfter opt: If true, cleanup after resolving/rejecting the returned Promise.
 * If false (default), cleanup before
 */
function WithTempDir (callback, opts = {unsafeCleanup: true, cleanupAfter: false, skipCleanup: false}) {
    return new Promise((resolve, reject) => {
        // Create temp dir to write into and which is automatically cleaned up
        // unsafe cleanup: Delete all files in the directory automatically
        tmp.dir(opts, (error, tmpPath, cleanupCallback) => {
            if (error) {
                return reject(error);
            }
            callback(tmpPath).then(arg => {
                // Callback-returned promise resolved
                if (opts.cleanupAfter === false && opts.skipCleanup === false) {
                    cleanupCallback(null);
                }
                resolve(arg);
                if (opts.cleanupAfter === true && opts.skipCleanup === false) {
                    cleanupCallback(null);
                }
            }).catch(arg => {
                if (opts.cleanupAfter === false && opts.skipCleanup === false) {
                    cleanupCallback(null);
                }
                reject(arg);
                if (opts.cleanupAfter === true && opts.skipCleanup === false) {
                    cleanupCallback(null);
                }
            });
        });
    });
}

module.exports = {
    WithTempDir: WithTempDir
};
