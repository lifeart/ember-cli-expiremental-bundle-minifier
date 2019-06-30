"use strict";
/* eslint-env node */
function babelPlugin() {
	return {
        name: "ember experimental bundle optimizer",
		visitor: {
            ObjectProperty(path) {
                const node = path.node;
                if (node.key.type === "StringLiteral" &&
                    node.key.value === "moduleName"
                ) {
                    if (node.value.type === "StringLiteral" && node.value.value.endsWith(".hbs")) {
                        node.value.value = "";
                    }
                }
            }
		}
	};
}

module.exports = babelPlugin;
// module.exports.
module.exports._parallelBabel = {
    requireFile: __filename
};