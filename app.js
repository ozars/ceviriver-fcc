'use strict';

const fs = require('fs-extra');
const readline = require('readline');
const webdriver = require('selenium-webdriver');

const tmpdir = 'tmp';

async function readNextLine(question) {
  let rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout
  });
  return new Promise(resolve => {
    rl.question(question, (answer) => { resolve(answer); rl.close(); });
  });
}

async function askOverwriteIfExists(dir) {
  if (fs.existsSync(dir)) {
    let answer;
    do {
      answer = await readNextLine(`'${dir}' exists. Overwrite it? (y/n) `);
    } while(['y', 'n'].indexOf(answer) == -1);
    if (answer == 'n') {
      console.log('Aborting...');
      return 1;
    }
    fs.removeSync(dir);
  }
}

async function main() {
  await askOverwriteIfExists(tmpdir);
  fs.mkdirSync(tmpdir);
}

main();
