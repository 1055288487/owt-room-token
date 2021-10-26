# require-native-executable
NodeJS startup check utility that ensures a native executables exists and else fails.

### Sync require

We recommend that you place this code in your module after your `require()` statements.

```js
const {requireNativeExecutableSync} = require("require-native-executable");

// Each of those will throw if the executable is not present
requireNativeExecutableSync('bash');
requireNativeExecutableSync('java');
```

The generated error will be a `NativeExecutableMissingError` and look like this:

```
The native executable 'java' was not found on your system but is required to load this application.
```

Use `err.exeName` to get the name of the missing executable

### Async require

```js
const {requireNativeExecutable} = require("require-native-executable");

// Will
requireNativeExecutable('java').then(() => {
    // Executable exists
}).catch(err => {
    // err will be a NativeExecutableMissingError, see above for an example.
});
```