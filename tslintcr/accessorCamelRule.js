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
            ({
                    __proto__: []
                }
                instanceof Array && function (d, b) {
                    d.__proto__ = b;
                }) ||
            function (d, b) {
                for (var p in b)
                    if (b.hasOwnProperty(p)) d[p] = b[p];
            };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);

        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Lint = requireGlobal("tslint");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);

    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new AccessorCamelWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "accessor must be camel";
    Rule.ACCESSOR_REGEX = /^[a-z][\w\d]+$/;
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
// The walker takes care of all the work.
var AccessorCamelWalker = /** @class */ (function (_super) {
    __extends(AccessorCamelWalker, _super);

    function AccessorCamelWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AccessorCamelWalker.prototype.visitSetAccessor = function (node) {
        this.validateNode(node);
        _super.prototype.visitSetAccessor.call(this, node);
    };
    AccessorCamelWalker.prototype.visitGetAccessor = function (node) {
        this.validateNode(node);
        _super.prototype.visitGetAccessor.call(this, node);
    };
    AccessorCamelWalker.prototype.validateNode = function (node) {
        if (node.name) {
            if (node.name.text) {
                var text = node.name.text;
                if (!Rule.ACCESSOR_REGEX.test(text)) {
                    this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
                }
            }
        }
    };
    return AccessorCamelWalker;
}(Lint.RuleWalker));