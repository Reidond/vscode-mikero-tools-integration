import * as vscode from 'vscode';
import Shell from 'node-powershell';

interface Command {
	program: string | undefined;
	options: string | undefined;
	filePath: vscode.Uri | undefined;
}

enum TypeOfCommand {
	MakePbo,
	ExtractPboDos,
	DeRapDos,
	Rapify,
	Default
}

export function activate(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration('vscode-mikero-tools-integration');
	context.subscriptions.push(
		vscode.commands.registerCommand('pboActions.makePbo', (dir: vscode.Uri) => {
			let commandObj = checkIfUsingBundled(context, TypeOfCommand.MakePbo, dir, config);
			runMikeroToolsFromPowershell(commandObj);
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('pboActions.extractPboDos', (dir: vscode.Uri) => {
			let commandObj = checkIfUsingBundled(context, TypeOfCommand.ExtractPboDos, dir, config);
			runMikeroToolsFromPowershell(commandObj);
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('configActions.deRapDos', (dir: vscode.Uri) => {
			let commandObj = checkIfUsingBundled(context, TypeOfCommand.DeRapDos, dir, config);
			runMikeroToolsFromPowershell(commandObj);
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('configActions.rapify', (dir: vscode.Uri) => {
			let commandObj = checkIfUsingBundled(context, TypeOfCommand.Rapify, dir, config);
			runMikeroToolsFromPowershell(commandObj);
		})
	);
}

export function deactivate() {}

function runMikeroToolsFromPowershell(commandObj: Command) {
	const ps = new Shell({
		executionPolicy: 'Bypass',
		noProfile: true
	});
	ps.addCommand(`& "${commandObj.program}" ${commandObj.options} ${commandObj.filePath}`);
	ps
		.invoke()
		.then((output: any) => {
			vscode.window.showInformationMessage(output);
		})
		.catch((err: any) => {
			vscode.window.showInformationMessage(err);
			ps.dispose();
		});
}

function getDefaultPathCommand(
	typeOfCommand: TypeOfCommand,
	dir: vscode.Uri | undefined,
	config: vscode.WorkspaceConfiguration
): Command {
	switch (typeOfCommand) {
		case TypeOfCommand.MakePbo:
			return { program: config.get('makePboPath'), options: config.get('makePboOptions'), filePath: dir };

		case TypeOfCommand.ExtractPboDos:
			return {
				program: config.get('extractPboDosPath'),
				options: config.get('extractPboDosOptions'),
				filePath: dir
			};

		case TypeOfCommand.DeRapDos:
			return {
				program: config.get('deRapDosPath'),
				options: config.get('deRapDosOptions'),
				filePath: dir
			};

		case TypeOfCommand.Rapify:
			return {
				program: config.get('rapifyPath'),
				options: config.get('rapifyOptions'),
				filePath: dir
			};

		default:
			return { program: undefined, options: undefined, filePath: undefined };
	}
}

function getBundledPathCommand(
	typeOfCommand: TypeOfCommand,
	dir: vscode.Uri | undefined,
	context: vscode.ExtensionContext
): Command {
	const bundledPath = `${context.extensionPath}\\bin`;
	switch (typeOfCommand) {
		case TypeOfCommand.MakePbo:
			return {
				program: `${bundledPath}\\MakePbo.exe`,
				options: '-X none -U',
				filePath: dir
			};

		case TypeOfCommand.ExtractPboDos:
			return {
				program: `${bundledPath}\\ExtractPboDos.exe`,
				options: '-KNR',
				filePath: dir
			};

		case TypeOfCommand.DeRapDos:
			return {
				program: `${bundledPath}\\DeRapDos.exe`,
				options: '',
				filePath: dir
			};

		case TypeOfCommand.Rapify:
			return {
				program: `${bundledPath}\\Rapify.exe`,
				options: '-N',
				filePath: dir
			};

		default:
			return { program: undefined, options: undefined, filePath: undefined };
	}
}

function checkIfUsingBundled(
	context: vscode.ExtensionContext,
	typeOfCommand: TypeOfCommand,
	dir: vscode.Uri | undefined,
	config: vscode.WorkspaceConfiguration
): Command {
	if (config.get('useBundled') === true) {
		return getBundledPathCommand(typeOfCommand, dir, context);
	}
	return getDefaultPathCommand(typeOfCommand, dir, config);
}
