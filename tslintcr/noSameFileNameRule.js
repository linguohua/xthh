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
var Lint = requireGlobal("tslint");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new SameFileNameWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "There is another file with the same name! please rename current file";
    // public static ACCESSOR_REGEX: RegExp = /^[a-z][\w\d]+$/;
    Rule.filenameMap = {};
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
// The walker takes care of all the work.
var SameFileNameWalker = /** @class */ (function (_super) {
    __extends(SameFileNameWalker, _super);
    function SameFileNameWalker(sourceFile, options) {
        return _super.call(this, sourceFile, options) || this;
    }
    SameFileNameWalker.prototype.visitSourceFile = function (node) {
        var sourceFileName = node.fileName;
        var endIdx = sourceFileName.lastIndexOf("/");
        var filename = sourceFileName.substr(endIdx + 1);
        // console.log(`sourceFile file name:${sourceFileName}`);
        if (Rule.filenameMap[filename] !== undefined && Rule.filenameMap[filename] !== sourceFileName) {
            console.log("EXIST:", Rule.filenameMap[filename]);
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        else {
            Rule.filenameMap[filename] = sourceFileName;
        }
    };
    return SameFileNameWalker;
}(Lint.RuleWalker));
