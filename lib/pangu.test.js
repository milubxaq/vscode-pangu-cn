'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { formatText } = require('./pangu');

test('中英文之间补空格', () => {
  assert.strictEqual(formatText('使用VSCode写Markdown'), '使用 VSCode 写 Markdown');
});

test('中文与数字之间补空格', () => {
  assert.strictEqual(formatText('共3个文件'), '共 3 个文件');
});

test('不修改纯英文与数字', () => {
  assert.strictEqual(formatText('npm install express'), 'npm install express');
});

test('中文标点前后不留空格', () => {
  assert.strictEqual(formatText('你好 ，世界 。'), '你好，世界。');
});

test('跳过围栏代码块', () => {
  const src = '说明文字\n```js\nconst a = "中文abc";\n```\n结束abc';
  const out = formatText(src);
  assert.match(out, /const a = "中文abc";/);
  assert.match(out, /结束 abc/);
});

test('跳过行内代码', () => {
  assert.strictEqual(formatText('执行`npm run前`命令'), '执行 `npm run前` 命令');
});

test('跳过链接 URL', () => {
  assert.strictEqual(formatText('访问https://example.com/中文查看'), '访问 https://example.com/中文查看');
});

test('保留 Markdown 链接结构', () => {
  assert.strictEqual(
    formatText('[官方文档abc](https://example.com/中文)说明'),
    '[官方文档 abc](https://example.com/中文) 说明'
  );
});

test('可选的中文标点转换', () => {
  assert.strictEqual(formatText('你好,世界', { punctuation: true }), '你好，世界');
  assert.strictEqual(formatText('版本1,2', { punctuation: true }), '版本 1,2');
});

test('幂等性', () => {
  const src = '使用VSCode写Markdown，共3个文件';
  const once = formatText(src);
  assert.strictEqual(formatText(once), once);
});
