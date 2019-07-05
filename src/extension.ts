import * as vscode from 'vscode';
import Shell from 'node-powershell';

interface Command {
	program: string | undefined;
	options: string | undefined;
	fsPath: string | undefined;
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
			let commandObj = checkIfUsingBundled(context, TypeOfCommand.MakePbo, dir.fsPath, config);
			runMikeroToolsFromPowershell(commandObj);
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('pboActions.extractPboDos', (dir: vscode.Uri) => {
			let commandObj = checkIfUsingBundled(context, TypeOfCommand.ExtractPboDos, dir.fsPath, config);
			runMikeroToolsFromPowershell(commandObj);
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('configActions.deRapDos', (dir: vscode.Uri) => {
			let commandObj = checkIfUsingBundled(context, TypeOfCommand.DeRapDos, dir.fsPath, config);
			runMikeroToolsFromPowershell(commandObj);
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('configActions.rapify', (dir: vscode.Uri) => {
			let commandObj = checkIfUsingBundled(context, TypeOfCommand.Rapify, dir.fsPath, config);
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
	vscode.window.showInformationMessage(
		`Running: & "${commandObj.program}" ${commandObj.options} "${commandObj.fsPath}"`
	);
	ps.addCommand(`& "${commandObj.program}" ${commandObj.options} "${commandObj.fsPath}"`);
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
	fsPath: string | undefined,
	config: vscode.WorkspaceConfiguration
): Command {
	switch (typeOfCommand) {
		case TypeOfCommand.MakePbo:
			return { program: config.get('makePboPath'), options: config.get('makePboOptions'), fsPath: fsPath };

		case TypeOfCommand.ExtractPboDos:
			return {
				program: config.get('extractPboDosPath'),
				options: config.get('extractPboDosOptions'),
				fsPath: fsPath
			};

		case TypeOfCommand.DeRapDos:
			return {
				program: config.get('deRapDosPath'),
				options: config.get('deRapDosOptions'),
				fsPath: fsPath
			};

		case TypeOfCommand.Rapify:
			return {
				program: config.get('rapifyPath'),
				options: config.get('rapifyOptions'),
				fsPath: fsPath
			};

		default:
			return { program: undefined, options: undefined, fsPath: undefined };
	}
}

function getBundledPathCommand(
	typeOfCommand: TypeOfCommand,
	fsPath: string | undefined,
	context: vscode.ExtensionContext
): Command {
	const bundledPath = `${context.extensionPath}\\bin`;
	switch (typeOfCommand) {
		case TypeOfCommand.MakePbo:
			return {
				program: `${bundledPath}\\MakePbo.exe`,
				options: '-X none -U',
				fsPath: fsPath
			};

		case TypeOfCommand.ExtractPboDos:
			return {
				program: `${bundledPath}\\ExtractPboDos.exe`,
				options: '-KNR',
				fsPath: fsPath
			};

		case TypeOfCommand.DeRapDos:
			return {
				program: `${bundledPath}\\DeRapDos.exe`,
				options: '',
				fsPath: fsPath
			};

		case TypeOfCommand.Rapify:
			return {
				program: `${bundledPath}\\Rapify.exe`,
				options: '-N',
				fsPath: fsPath
			};

		default:
			return { program: undefined, options: undefined, fsPath: undefined };
	}
}

function checkIfUsingBundled(
	context: vscode.ExtensionContext,
	typeOfCommand: TypeOfCommand,
	fsPath: string | undefined,
	config: vscode.WorkspaceConfiguration
): Command {
	if (config.get('useBundled') === true) {
		return getBundledPathCommand(typeOfCommand, fsPath, context);
	}
	return getDefaultPathCommand(typeOfCommand, fsPath, config);
}
