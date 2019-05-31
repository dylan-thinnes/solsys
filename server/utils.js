var removeMetadata = (keys, planet) => {
    for (var key of keys) delete planet[key];
    for (var child of planet.children) {
        if (child == null) continue;
        removeMetadata(keys, child);
    }
}
module.exports.removeMetadata = removeMetadata;

