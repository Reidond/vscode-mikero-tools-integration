import * as vscode from 'vscode';

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

	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
