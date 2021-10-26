# with-tmp-dir-promise
Run a promise-based function with a temporary directory, deleting it afterwards.

Requires NodeJS 8+.

# Installation

```sh
npm install --save with-tmp-dir-promise
```

# Usage example

```js
const {WithTempDir} = require('with-tmp-dir-promise');

WithTempDir(function (tmpdir) {
    // tmpdir is a string like '/tmp/q3q235',
    // pointing to an existing temporary directory

    // Your code goes here

    // When this function returns, the tmp directory will be deleted
    // Remember to return a Promise here!
    return Promise.resolve("foobar"); // Example
}).then(function(arg) {
    // arg === 'foobar'

    // tmpdir, including all files in the directory,
    // is deleted here
});
```

# WithTempDir documentation

```js
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
function WithTempDir (callback, opts = {unsafeCleanup: true, cleanupAfter: false}) {
    // ...
}
```
