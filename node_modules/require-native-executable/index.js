const commandExists = require('command-exists');
const commandExistsSync = commandExists.sync;

class NativeExecutableMissingError extends Error {
}

function _err(exeName) {
    const err = new NativeExecutableMissingError(`The native executable '${exeName}' was not found on your system but is required to load this application.`);
    err.exeName = exeName;
    return err;
}

module.exports = {
    /**
     * Check if a native executable exist - if not, throw an error
     */
    requireNativeExecutableSync: function(exeName) {
        if(!commandExistsSync(exeName)) {
            throw _err(exeName);
        }
    },
    requireNativeExecutable: function(exeName) {
        return new Promise((resolve, reject) => {
            commandExists(exeName).then(resolve).catch(() => {
                reject(_err(exeName));
            });
        });
    },
    NativeExecutableMissingError: NativeExecutableMissingError
}
