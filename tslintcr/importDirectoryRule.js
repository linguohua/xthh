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
// Joins path segments.  Preserves initial "/" and resolves ".." and "."
// Does not support using ".." to go above/outside the root.
// This means that join("foo", "../../bar") will not resolve to "../bar"
function join() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    // Split the inputs into a list of path commands.
    var parts = [];
    for (var i = 0, l = args.length; i < l; i++) {
        parts = parts.concat(args[i].split("/"));
    }
    // Interpret the path commands to get the new resolved path.
    var newParts = [];
    for (i = 0, l = parts.length; i < l; i++) {
        var part = parts[i];
        // Remove leading and trailing slashes
        // Also remove "." segments
        if (!part || part === ".")
            continue;
        // Interpret ".." to pop the last segment
        if (part === "..")
            newParts.pop();
        // Push new path segments.
        else
            newParts.push(part);
    }
    // Preserve the initial slash if there was one.
    if (parts[0] === "")
        newParts.unshift("");
    // Turn back into a single string path.
    return newParts.join("/") || (newParts.length ? "/" : ".");
}
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // public static ACCESSOR_REGEX: RegExp = /^[a-z][\w\d]+$/;
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new ImportDirectoryWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = "should import dir which has index.ts, not file";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
// The walker takes care of all the work.
var ImportDirectoryWalker = /** @class */ (function (_super) {
    __extends(ImportDirectoryWalker, _super);
    function ImportDirectoryWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.ignoreTags = _this.getOptions();
        return _this;
    }
    ImportDirectoryWalker.prototype.visitImportDeclaration = function (node) {
        var sourceFilePathName = this.getSourceFile().fileName;
        var sourceFilePath = sourceFilePathName.substring(0, sourceFilePathName.lastIndexOf("/"));
        var moduleSpecifierText = node.moduleSpecifier.text;
        if (moduleSpecifierText !== undefined) {
            var modulePath = join(sourceFilePath, moduleSpecifierText);
            this.verifyImportPath(sourceFilePath, modulePath, node);
        }
        _super.prototype.visitImportDeclaration.call(this, node);
    };
    ImportDirectoryWalker.prototype.verifyImportPath = function (sourceFilePath, modulePath, node) {
        var length = this.ignoreTags.length;
        for (var i = 0; i < length; i++) {
            var x = this.ignoreTags[i];
            if (modulePath.indexOf(x) >= 0) {
                return;
            }
        }
        // import parent index.ts
        if (sourceFilePath.indexOf(modulePath) >= 0) {
            return;
        }
        // import sub-module
        if (modulePath.indexOf(sourceFilePath) >= 0) {
            return;
        }
		
		const moduleName = modulePath.substring(modulePath.lastIndexOf("/")+1);
		if (moduleName.indexOf("Exports") > 0 ) {
			return;
		}

        var parentModulePath = modulePath.substring(0, modulePath.lastIndexOf("/"));
        if (sourceFilePath.indexOf(parentModulePath) >= 0) {
            return;
        }
		
        //console.log("Failed,sourceFilePath:" + sourceFilePath + ",modulePath:" + modulePath);
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
    };
    return ImportDirectoryWalker;
}(Lint.RuleWalker));
