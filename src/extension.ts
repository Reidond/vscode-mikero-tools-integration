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
	console.log('Congratulations, your extension "vscode-mikero-tools-integration" is now active!');

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

	context.subscriptions.push(disposable);
}

export function deactivate() {}
