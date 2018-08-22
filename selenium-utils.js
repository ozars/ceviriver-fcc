const wd = require('selenium-webdriver/lib/webdriver');

wd.WebDriver.prototype.closeOtherTabs = async function() {
  let activeHandle = await this.getWindowHandle();
  let handles = await this.getAllWindowHandles();
  for (let handle of handles) {
    if (handle != activeHandle) {
      await this.switchTo().window(handle);
      await this.close();
    }
  }
  await this.switchTo().window(activeHandle);
}

wd.WebDriver.prototype.switchToPopup = async function() {
  let oldHandles = await this.getAllWindowHandles();
  console.log(oldHandles);
  await this.wait(async () => {
    let handles = await this.getAllWindowHandles();
    if (handles.length == oldHandles.length) {
      return false;
    }
    console.log(handles);
    for (let i = 0; i < oldHandles.length; i++) {
      if (handles[i] != oldHandles[i]) {
        await this.switchTo().window(handles[i]);
        return true;
      }
    }
    await this.switchTo().window(handles[handles.length - 1]);
    return true;
  });
}

wd.WebDriver.prototype.closeTab = async function() {
  let handles = await this.getAllWindowHandles();
  let activeHandle = await this.getWindowHandle();
  if (handles.length == 1) {
    this.quit();
  } else {
    let i = handles.indexOf(activeHandle);
    await this.close();
    if (i == 0) {
      await this.switchTo().window(handles[1]);
    } else if(i == handles.length - 1) {
      await this.switchTo().window(handles[i - 1]);
    } else {
      await this.switchTo().window(handles[i + 1]);
    }
  }
}

wd.WebDriver.prototype.navigate = function(url) {
  let script = () => { window.location = arguments[0]; };
  return this.executeScript(script, url);
}
