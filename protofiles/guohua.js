const fs = require('fs');
const readline = require('readline');

const enumMap = {};

function isEnumType(enumName, namespaceName) {
	let nmap = enumMap[namespaceName];
	if (nmap === undefined) {
		return false;
	}

	return nmap[enumName] !== undefined;
}

function addEnum2Map(enumName, namespaceName) {
	let nmap = enumMap[namespaceName];
	if (nmap === undefined) {
		nmap = {};
		enumMap[namespaceName] = nmap;
	}

	nmap[enumName] = enumName;
}

function getTypeStr(typ, namespaceName) {
	let typeStr = "";
	switch (typ) {
		case "uint32":
		case "int32":
		typeStr = "number";
		break;
		case "int64":
		case "uint64":
		typeStr = "Long";
		break;
		case "bool":
		typeStr = "boolean";
		break;
		case "bytes":
		typeStr = "ByteBuffer";
		break;
		case "string":
		typeStr = "string";
		break;
		case "float":
		typeStr = "number";
		break;
		default:
		if (isEnumType(typ, namespaceName)) {
			typeStr = namespaceName+"."+typ;
		} else {
			typeStr = namespaceName+".I"+typ;
		}
		break;
	}

	return typeStr;
}

function genFieldTypeNameForInterface(field, outputContext) {
	const rule = field.rule;
	const typ = field.type;
	const fieldName = field.name;
	const namespaceName = outputContext.namespaceName;

	let typeStr = getTypeStr(typ,namespaceName);
	let str;

	switch (rule) {
		case "optional":
		str = fieldName + "?:";
		break;
		case "required":
		str = fieldName + ":";
		break;
		case "repeated":
		str = fieldName + "?:";
		typeStr += "[]";
		break;
		default:
		throw "unsupported rule:"+rule;
	}

	return str + " " + typeStr;
}

function genFieldTypeNameForClass(field, outputContext) {
	const rule = field.rule;
	const typ = field.type;
	const fieldName = field.name;
	const namespaceName = outputContext.namespaceName;

	let typeStr = getTypeStr(typ,namespaceName);
	let str = fieldName + ":";

	switch (rule) {
		case "repeated":
		str = fieldName + ":";
		typeStr += "[]";
		break;
		default:
		break;
	}

	return "public " + str + " " + typeStr;
}

function procField(field, outputContext, isForInterface) {
	let line;
	if (isForInterface) {
		line = genFieldTypeNameForInterface(field, outputContext) + ";\n";
	} else {
		line = genFieldTypeNameForClass(field, outputContext) + ";\n";
	}

	outputContext.writeLine(line);
}

function procMessage(message, outputContext) {
	// 写interface
	const className = message.name
	const interfaceName = "I" + className;
	outputContext.writeLine("interface "+interfaceName+" {\n");
	outputContext.indent++;
	for (const field of message.fields) {
		// console.log(field);
		procField(field, outputContext, true);
	}
	outputContext.indent--;
	outputContext.writeLine("}\n\n");

	// 写class
	outputContext.writeLine("class "+className+" implements " + interfaceName + " {\n");
	outputContext.indent++;
	for (const field of message.fields) {
		procField(field, outputContext, false);
	}
	// constructor
	const fullInterfaceName = outputContext.namespaceName + "." + interfaceName;
	outputContext.writeLine("constructor(properties?: "  + fullInterfaceName + ");\n");
	// encode
	outputContext.writeLine("public static encode(message: "+className+"): ByteBuffer;\n");
	// decode
	outputContext.writeLine("public static decode(reader: Uint8Array|ByteBuffer): "+className+";\n");

	outputContext.indent--;
	outputContext.writeLine("}\n\n");
}

function procEnum(enu, outputContext) {
	const enumName = enu.name;
	outputContext.writeLine("enum "+enumName+" {\n");

	const namespaceName = outputContext.namespaceName;
	addEnum2Map(enumName, namespaceName);

	outputContext.indent++;
	for (const value of enu.values) {
		// console.log(field);
		outputContext.writeLine(value.name+" = "+value.id+",\n");
	}
	outputContext.indent--;

	outputContext.writeLine("}\n\n");
}

function procNamespace(namespace, outputContext) {
	let namespaceName = namespace.name;
	if (namespaceName === undefined) {
		namespaceName = namespace.package;
	}

	outputContext.writeLine("export namespace " + namespaceName + " {\n");

	outputContext.namespaceName = namespaceName;

	// 写enumeration
	if (namespace.enums !== undefined) {
		for (const enu of namespace.enums) {
			outputContext.indent++;
			procEnum(enu, outputContext);
			outputContext.indent--;
		}
	}


	// write message
	if (namespace.messages !== undefined) {
		for (const message of namespace.messages) {
			outputContext.indent++;
			procMessage(message, outputContext);
			outputContext.indent--;
		}
	}

	outputContext.writeLine("}\n");
}

function fixJSFile(inputJSFile, protoPath) {
	const origin = fs.readFileSync(inputJSFile, 'utf8')
	let newContent = origin.replace("module.exports", "exports.proto");
	newContent = newContent.replace("protobufjs", protoPath);

	fs.writeFileSync(inputJSFile, newContent);
}

async function main() {
	var myArgs = process.argv.slice(2);
	//console.log('myArgs: ', myArgs);
	if (myArgs.length < 3) {
		console.log("please specify input and output files");
		return;
	}

	const inputJSFile = myArgs[0];
	if (myArgs[1] === "-x") {
		const protoPath = myArgs[2];
		fixJSFile(inputJSFile, protoPath);

		return;
	}

	if (myArgs[1] !== "-o") {
		console.log("please specify output file with -o");
		return;
	}

	const outputTSFile = myArgs[2];

	// 读取文件
	const lineReader = readline.createInterface({
	  input: fs.createReadStream(inputJSFile)
	});

	const lines = [];
	lineReader.on('line', (line) => {
	  lines.push(line);
	});

	await new Promise((resolve)=>{
		lineReader.on('close', ()=> {
			resolve();
		});
	});

	const length = lines.length;
	if (length < 1) {
		console.log("invalid input");
		return;
	}
	// 替换头部第一行
	lines[0] = "{";
	// 替换尾部最后一行
	lines[length-1] = "}";

	let str = "";
	for(const line of lines) {
		str += line;
	}

	// 转为json对象
	const root = JSON.parse(str);

	// console.log(root);

	// 遍历所有全局名字空间，暂时不支持名字空间跨越
	const outputContext = {};
	outputContext.indent = 0;
	outputContext.str = "";

	outputContext.writeLine = function(line) {
		for (let i = 0; i < outputContext.indent; i++) {
			outputContext.str += "\t";
		}

		outputContext.str += line;
	}

	outputContext.writeLine("export namespace proto {\n");
	outputContext.indent++;
	if (root.package !== null) {
		procNamespace(root, outputContext);
	} else {
		for (const namespace of root.messages) {
			// console.log(namespace);
			procNamespace(namespace, outputContext);
		}
	}
	outputContext.indent--;
	outputContext.writeLine("}\n");
	fs.writeFileSync(outputTSFile, outputContext.str);
}

main();
