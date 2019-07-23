import * as vscode from "vscode";

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
    const config = vscode.workspace.getConfiguration(
        "vscode-mikero-tools-integration"
    );
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "pboActions.makePbo",
            (dir: vscode.Uri) => {
                let commandObj = checkIfUsingBundled(
                    context,
                    TypeOfCommand.MakePbo,
                    dir.fsPath,
                    config
                );
                runMikeroTools(commandObj);
            }
        )
    );
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "pboActions.extractPboDos",
            (dir: vscode.Uri) => {
                let commandObj = checkIfUsingBundled(
                    context,
                    TypeOfCommand.ExtractPboDos,
                    dir.fsPath,
                    config
                );
                runMikeroTools(commandObj);
            }
        )
    );
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "configActions.deRapDos",
            (dir: vscode.Uri) => {
                let commandObj = checkIfUsingBundled(
                    context,
                    TypeOfCommand.DeRapDos,
                    dir.fsPath,
                    config
                );
                runMikeroTools(commandObj);
            }
        )
    );
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "configActions.rapify",
            (dir: vscode.Uri) => {
                let commandObj = checkIfUsingBundled(
                    context,
                    TypeOfCommand.Rapify,
                    dir.fsPath,
                    config
                );
                runMikeroTools(commandObj);
            }
        )
    );
}

export function deactivate() {}

function runMikeroTools(commandObj: Command) {
    const command = `& "${commandObj.program}" ${commandObj.options} "${
        commandObj.fsPath
    }"`;
    const terminal = vscode.window.createTerminal();
    terminal.sendText(command);
    terminal.show(false);
}

function getCommandToRun(
    typeOfCommand: TypeOfCommand,
    fsPath: string | undefined,
    config: vscode.WorkspaceConfiguration,
    context: vscode.ExtensionContext,
    isBundled: boolean = false
): Command {
    const bundledPath = `${context.extensionPath}\\bin`;
    switch (typeOfCommand) {
        case TypeOfCommand.MakePbo:
            return {
                program: !isBundled
                    ? config.get("makePboPath")
                    : `${bundledPath}\\MakePbo.exe`,
                options: !isBundled
                    ? config.get("makePboOptions")
                    : config.get("bundledMakePboOptions"),
                fsPath: fsPath
            };

        case TypeOfCommand.ExtractPboDos:
            return {
                program: !isBundled
                    ? config.get("extractPboDosPath")
                    : `${bundledPath}\\ExtractPboDos.exe`,
                options: !isBundled
                    ? config.get("extractPboDosOptions")
                    : config.get("bundledExtractPboDosOptions"),
                fsPath: fsPath
            };

        case TypeOfCommand.DeRapDos:
            return {
                program: !isBundled
                    ? config.get("deRapDosPath")
                    : `${bundledPath}\\DeRapDos.exe`,
                options: !isBundled
                    ? config.get("deRapDosOptions")
                    : config.get("bundledDeRapDosOptions"),
                fsPath: fsPath
            };

        case TypeOfCommand.Rapify:
            return {
                program: !isBundled
                    ? config.get("rapifyPath")
                    : `${bundledPath}\\Rapify.exe`,
                options: !isBundled
                    ? config.get("rapifyOptions")
                    : config.get("bundledRapifyOptions"),
                fsPath: fsPath
            };

        default:
            return {
                program: undefined,
                options: undefined,
                fsPath: undefined
            };
    }
}

function checkIfUsingBundled(
    context: vscode.ExtensionContext,
    typeOfCommand: TypeOfCommand,
    fsPath: string | undefined,
    config: vscode.WorkspaceConfiguration
): Command {
    if (config.get("useBundled") === true) {
        return getCommandToRun(typeOfCommand, fsPath, config, context, true);
    }
    return getCommandToRun(typeOfCommand, fsPath, config, context);
}
