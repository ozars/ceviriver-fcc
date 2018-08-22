'use strict';

const fs = require('fs-extra');
const readline = require('readline');
const wd = require('selenium-webdriver');
require('geckodriver');

require('./selenium-utils.js');

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

async function installCeviriver(driver) {
  console.log(driver);
  /* Install tampermonkey. */
  await driver.installAddon('vendor/tampermonkey.xpi');
  console.log('Installed tampermonkey.');

  /* Wait for tampermonkey update tab and close it. */
  await driver.switchToPopup();
  await driver.closeTab();
  console.log('Closed tampermonkey tab.');

  /* Install user script. */
  await driver.navigate(
    'https://github.com/ozars/ceviriver/raw/master/ceviriver.user.js');
  await driver.switchToPopup();
  await driver.closeOtherTabs();
  await driver.wait(wd.until.elementLocated(wd.By.name('Install')));
  await driver.executeScript(() => {
    document.getElementsByName('Install')[0].click();
  });
  console.log('Installed Ceviriver');
}

async function main() {
  await askOverwriteIfExists(tmpdir);
  fs.mkdirSync(tmpdir);

  let driver = await new wd.Builder()
    .withCapabilities({
      'moz:firefoxOptions' : {
        'binary' : 'vendor/firefox/firefox',
        'log' : {'level' : 'trace' }
      }
    }).forBrowser('firefox').build();


  try {
    await installCeviriver(driver);
  } finally {
    await driver.quit();
  }
}

return main();
