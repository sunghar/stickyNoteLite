// ./app/index.js

'use strict';

const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, dialog } = require('electron');
const nodePersist = require('node-persist');
const fs = require('fs');
const path = require('path');

let store = nodePersist.create();
let mainWindow;
let trayIcon;
app.on('window-all-closed', function () {
	if (process.platform != 'darwin') {
		app.quit();
	}
});
app.on('ready', async () => {
	await store.init();
	mainWindow = new BrowserWindow({
		icon: 'src/icon.ico',
		width: 300,
		height: 600,
		frame: false,
		skipTaskbar: true,
		transparent: true,
		movable: true,
		resizable: true,
		minimizable: false,
		maximizable: false,
		fullscreenable: false,
		closable: true,
		webPreferences: {
			preload: path.join(__dirname, './preload.js'),
			nodeIntegration: true,
			contextIsolation: true // 否则页面无法用require
		}
	});

	const position = await store.getItem('window-position');
	restoreWindowPosition();
	mainWindow.loadURL('file://' + __dirname + '/index.html');
	//mainwindow.openDevTools();

	mainWindow.on('closed', async () => {
		mainWindow = null;

	});

	app.on('activate', function () {
		// 在 macOS 上，当点击 Dock 图标并且没有其他打开的浏览器窗口时，通常在应用程序中重新创建一个窗口。  
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});

	// 创建托盘图标  
	const iconPath = path.join(__dirname, 'src/icon.png');
	trayIcon = new Tray(nativeImage.createFromPath(iconPath));

	const contextMenu = Menu.buildFromTemplate([
		{
			label: '显示窗口', type: 'normal',
			click: () => {
				mainWindow.show();
			}
		},
		{
			label: '退出',
			type: 'normal',
			click: () => storeWindowPosition()//app.quit()
		}
	]);

	trayIcon.setContextMenu(contextMenu);

	trayIcon.on('click', () => {
		console.log('[index.js] Tray icon clicked');
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		} else {
			mainWindow.focus();
		}
	});

	trayIcon.on('double-click', () => {
		console.log('[index.js] Tray icon double-clicked');
	});

	trayIcon.on('right-click', (event, bounds) => {
		console.log('[index.js] Tray icon right-clicked');
	});
	setTimeout(() => {
		mainWindow.show();
		mainWindow.focus();
	}, 1000);



	ipcMain.on('close-window', (event) => {
		mainWindow.hide();
	});

	ipcMain.on('save-data', (event, data) => {
		const dataString = JSON.stringify(data);
		const filePath = path.join(process.cwd(), 'data.json');
		fs.writeFile(filePath, dataString, 'utf8', (err) => {
			if (err) {
				console.log('[index.js] data save to file error:', err);
				event.reply('data-saved', false);
			} else {
				console.log('[index.js] data save to file success', filePath);
				event.reply('data-saved', true);
			}
		});
	});

	ipcMain.on('restore-data', (event, targetPath) => {
		var filePath = path.join(process.cwd(), 'data.json');

		if (targetPath != "") {
			filePath = targetPath;
		}
		console.log('[index.js] restore data file path:'+ filePath);
		fs.readFile(filePath, 'utf8', (err, data) => {
			if (err) {
				console.log('[index.js] restore read file error:', err);
				event.reply('restore-data', null);
			} else {
				try {
					const parsedData = JSON.parse(data);
					event.reply('restore-data', parsedData);
				} catch (e) {
					console.log('[index.js] restore file parse JSON failed:', e);
					event.reply('restore-data', null);
				}
			}
		});
	});

	async function restoreWindowPosition() {
		const position = await store.getItem('window-position');
		console.log("[index.js] get windows position x:" + position.x + " y:" +position.y);
		if (position.x && position.y && mainWindow) {
			mainWindow.setPosition(position.x, position.y,0);
		}
	}

	function storeWindowPosition() {
		const position = mainWindow.getPosition();
		console.log("[index.js] save windows position x:" + position[0] + " y:" + position[1]);
		store.setItem('window-position', { x: position[0], y: position[1] });
		app.quit()
	}

});
