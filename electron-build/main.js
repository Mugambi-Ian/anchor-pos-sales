// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");

function createWindow() {
  const app = new BrowserWindow({
    minWidth: 950,
    minHeight: 650,
  });
  app.removeMenu();
  app.loadFile("./app/index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("browser-window-created", function (e, window) {
  window.removeMenu();
});
