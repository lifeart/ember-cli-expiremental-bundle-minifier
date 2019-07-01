"use strict";
/* eslint-env node */
function babelPlugin() {
	return {
        name: "ember experimental bundle optimizer",
		visitor: {
            ExpressionStatement(path) {
                const node = path.node;
                const exp = node.expression;
                // const cname = exp.callee.name;
                if (exp.type === "CallExpression" && (exp.callee.type === "Identifier" || exp.callee.type === "MemberExpression")) {
                    // && (['define','e','alias','require','exports','unsee'].includes(cname)
                    const args = exp.arguments;
                    if (args.length) {
                        if (args[0].type === "StringLiteral") {
                            const value = args[0].value;
                            // -debug-
                            // console.log('value', value);
                            if (value === "foo" || value.startsWith("foo/") || value.startsWith('ember-test-waiters') || value.includes('-debug-') || value.includes("-for-debugging")) {
                                path.remove();
                                return null;
                            }
                        }
                    }
                }
            },
            ThrowStatement(path) {
                const node = path.node;
                if (node.argument.type === "NewExpression") {
                    node.argument.arguments = [
                        {
                            type: 'StringLiteral',
                            value: "",
                            extra: {
                                rawValue: "",
                                raw: "\"\""
                            },
                            loc: null
                        }
                    ]
                }
            },
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