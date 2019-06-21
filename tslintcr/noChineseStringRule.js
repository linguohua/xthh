"use strict";
function requireGlobal(packageName) {
    var childProcess = require('child_process');
    var path = require('path');
    var fs = require('fs');

    var globalNodeModules = childProcess.execSync('npm root -g').toString().trim();
    var packageDir = path.join(globalNodeModules, packageName);
    if (!fs.existsSync(packageDir))
        packageDir = path.join(globalNodeModules, 'npm/node_modules', packageName); //find package required by old npm

    if (!fs.existsSync(packageDir))
        throw new Error('Cannot find global module \'' + packageName + '\'');

    var packageMeta = JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json')).toString());
    var main = path.join(packageDir, packageMeta.main);

    return require(main);
}
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var ts = requireGlobal("typescript");
var Lint = requireGlobal("tslint");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new StringLiteralWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "foolish! don't input 中文 leteral in code files";
    Rule.ASCII_REGEX = /^[\x00-\x7F]*$/;
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
// The walker takes care of all the work.
var StringLiteralWalker = /** @class */ (function (_super) {
    __extends(StringLiteralWalker, _super);
    // private readonly ignoreTags: [];
    function StringLiteralWalker(sourceFile, options) {
        return _super.call(this, sourceFile, options) || this;
        // this.ignoreTags = this.getOptions();
    }
    StringLiteralWalker.prototype.visitNode = function (node) {
        if (node.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
            var xNode = node;
            this.visitLiteralExpression(xNode);
        }
        else if (node.kind === ts.SyntaxKind.TemplateExpression) {
            var xNode = node;
            this.visitLiteralExpression(xNode);
        }
        else if (node.kind === ts.SyntaxKind.StringLiteral) {
            var xNode = node;
            this.visitLiteralExpression(xNode);
        }
        _super.prototype.visitNode.call(this, node);
    };
    StringLiteralWalker.prototype.visitLiteralExpression = function (node) {
        var stringText = node.getFullText();
        if (stringText !== undefined) {
            if (!Rule.ASCII_REGEX.test(stringText)) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
            }
        }
    };
    return StringLiteralWalker;
}(Lint.RuleWalker));
