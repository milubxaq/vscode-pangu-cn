'use strict';

const vscode = require('vscode');
const { formatText } = require('./lib/pangu');

const CONFIG = 'panguCn';

/** 读取用户配置 */
function getOptions() {
  const cfg = vscode.workspace.getConfiguration(CONFIG);
  return {
    spacing: cfg.get('enableSpacing', true),
    punctuation: cfg.get('enablePunctuation', false),
  };
}

function isLanguageAllowed(document) {
  const list = vscode.workspace.getConfiguration(CONFIG).get('languages', []);
  if (!list.length) return true;
  return list.includes(document.languageId);
}

/** 对整个文档生成 TextEdit */
function buildFullDocumentEdit(document, options) {
  const original = document.getText();
  const formatted = formatText(original, options);
  if (formatted === original) return null;
  const end = document.lineAt(document.lineCount - 1).range.end;
  return new vscode.TextEdit(new vscode.Range(new vscode.Position(0, 0), end), formatted);
}

/** 对当前选区生成 TextEdit */
function buildSelectionEdit(editor, options) {
  const edits = [];
  for (const selection of editor.selections) {
    const original = editor.document.getText(selection);
    const formatted = formatText(original, options);
    if (formatted !== original) {
      edits.push(new vscode.TextEdit(selection, formatted));
    }
  }
  return edits;
}

async function formatDocument(editor) {
  if (!editor) return;
  if (!isLanguageAllowed(editor.document)) {
    const msg = `当前语言 ${editor.document.languageId} 未启用中文排版，可在设置 panguCn.languages 中添加`;
    vscode.window.showWarningMessage(msg);
    return;
  }
  const edit = buildFullDocumentEdit(editor.document, getOptions());
  if (!edit) {
    vscode.window.setStatusBarMessage('中文排版：无需修改', 3000);
    return;
  }
  const applied = await editor.edit((builder) => builder.replace(edit.range, edit.newText));
  if (applied) vscode.window.setStatusBarMessage('中文排版：已格式化', 3000);
}

async function formatSelection(editor) {
  if (!editor) return;
  const edits = buildSelectionEdit(editor, getOptions());
  if (!edits.length) {
    vscode.window.setStatusBarMessage('中文排版：选区无需修改', 3000);
    return;
  }
  const applied = await editor.edit((builder) => {
    for (const e of edits) builder.replace(e.range, e.newText);
  });
  if (applied) vscode.window.setStatusBarMessage('中文排版：已格式化选区', 3000);
}

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('panguCn.formatDocument', async () => {
      await formatDocument(vscode.window.activeTextEditor);
    }),
    vscode.commands.registerCommand('panguCn.formatSelection', async () => {
      await formatSelection(vscode.window.activeTextEditor);
    }),
    vscode.commands.registerCommand('panguCn.toggleOnSave', async () => {
      const cfg = vscode.workspace.getConfiguration(CONFIG);
      const current = cfg.get('formatOnSave', false);
      const target = vscode.workspace.workspaceFolders ? vscode.ConfigurationTarget.Workspace : vscode.ConfigurationTarget.Global;
      await cfg.update('formatOnSave', !current, target);
      vscode.window.showInformationMessage(`保存时自动排版：${!current ? '已开启' : '已关闭'}`);
    }),
    vscode.workspace.onWillSaveTextDocument((event) => {
      const enabled = vscode.workspace.getConfiguration(CONFIG).get('formatOnSave', false);
      if (!enabled || !isLanguageAllowed(event.document)) return;
      const edit = buildFullDocumentEdit(event.document, getOptions());
      if (edit) event.waitUntil(Promise.resolve([edit]));
    })
  );

  const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  status.text = '$(symbol-keyword) 中文排版';
  status.tooltip = '点击格式化当前文档（Pangu）';
  status.command = 'panguCn.formatDocument';
  status.show();
  context.subscriptions.push(status);
}

function deactivate() {}

module.exports = { activate, deactivate };
