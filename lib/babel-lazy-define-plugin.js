// const { parse } = require('@babel/parser');
const { CodeGenerator } = require("@babel/generator");

("use strict");
/* eslint-env node */
function babelLazyPlugin(babel) {
  const { types: t } = babel;
  return {
    name: "ember lazy define",
    visitor: {
      ExpressionStatement(path) {
        const node = path.node;
        if (
          t.isCallExpression(node.expression) &&
          t.isIdentifier(node.expression.callee) &&
          node.expression.callee.name === "define"
        ) {
          const lastArgument =
            node.expression.arguments[node.expression.arguments.length - 1];

          if (lastArgument.type !== "FunctionExpression") {
            return;
          }
          const gen = new CodeGenerator(
            t.CallExpression(
              t.FunctionExpression(null, [], lastArgument.body),
              []
            )
          );
          lastArgument.body = t.BlockStatement([
            t.ReturnStatement(
              t.CallExpression(t.Identifier("eval"), [
                t.StringLiteral("(" + gen.generate().code + ")")
              ])
            )
          ]);

          // console.log(JSON.stringify(lastArgument.body));
        }
      }
    }
  };
}

module.exports = babelLazyPlugin;
// module.exports.
module.exports._parallelBabel = {
  requireFile: __filename
};
