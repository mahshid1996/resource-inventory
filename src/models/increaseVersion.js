//this file is for adding the number value of the version field
function increaseVersion() {
    const update = this.getUpdate();
    if (!update) return;
    if (update.version) {
        delete update.version;
    }
    const keys = ['$set', '$setOnInsert'];
    keys.forEach(key => {
        if (update[key] && update[key].version) {
            delete update[key].version;
            if (Object.keys(update[key]).length === 0) {
                delete update[key];
            }
        }
    });
    update.$inc = update.$inc || {};
    update.$inc.version = 1;
}


function increaseResourceVersion() {
    const update = this.getUpdate();
    if (!update) return;
    if (update.resourceVersion) {
        delete update.resourceVersion;
    }
    const keys = ['$set', '$setOnInsert'];
    keys.forEach(key => {
        if (update[key] && update[key].resourceVersion) {
            delete update[key].resourceVersion;
            if (Object.keys(update[key]).length === 0) {
                delete update[key];
            }
        }
    });
    update.$inc = update.$inc || {};
    update.$inc.resourceVersion = 1;
}

module.exports = {
    increaseVersion,
    increaseResourceVersion
};
