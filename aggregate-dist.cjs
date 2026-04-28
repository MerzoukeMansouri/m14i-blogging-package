#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Create root dist directory
const rootDist = path.join(__dirname, 'dist');
if (!fs.existsSync(rootDist)) {
  fs.mkdirSync(rootDist, { recursive: true });
} else {
  // Clean existing files but keep the directory
  fs.readdirSync(rootDist).forEach(file => {
    const filePath = path.join(rootDist, file);
    if (fs.statSync(filePath).isDirectory()) {
      fs.rmSync(filePath, { recursive: true });
    } else {
      fs.unlinkSync(filePath);
    }
  });
}

// Copy core package dist files to root dist
const coreDist = path.join(__dirname, 'packages/core/dist');
if (fs.existsSync(coreDist)) {
  fs.readdirSync(coreDist).forEach(file => {
    const src = path.join(coreDist, file);
    const dest = path.join(rootDist, file);
    if (fs.statSync(src).isDirectory()) {
      fs.cpSync(src, dest, { recursive: true });
    } else {
      fs.copyFileSync(src, dest);
    }
  });
}

// Copy admin package dist files to root dist/admin
const adminDist = path.join(__dirname, 'packages/admin/dist');
if (fs.existsSync(adminDist)) {
  const adminDestDir = path.join(rootDist, 'admin');
  fs.mkdirSync(adminDestDir, { recursive: true });
  fs.readdirSync(adminDist).forEach(file => {
    const src = path.join(adminDist, file);
    const dest = path.join(adminDestDir, file);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
    }
  });
}

// Copy server package dist files to root dist/server
const serverDist = path.join(__dirname, 'packages/server/dist');
if (fs.existsSync(serverDist)) {
  const serverDestDir = path.join(rootDist, 'server');
  fs.mkdirSync(serverDestDir, { recursive: true });
  fs.readdirSync(serverDist).forEach(file => {
    const src = path.join(serverDist, file);
    const dest = path.join(serverDestDir, file);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
    }
  });
}

// Copy public files if they exist (from core/dist/public or separate package)
const publicSrc = path.join(__dirname, 'packages/public/dist');
if (fs.existsSync(publicSrc)) {
  const publicDestDir = path.join(rootDist, 'public');
  fs.mkdirSync(publicDestDir, { recursive: true });
  fs.readdirSync(publicSrc).forEach(file => {
    const src = path.join(publicSrc, file);
    const dest = path.join(publicDestDir, file);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
    }
  });
}

console.log('✓ Aggregated dist files from all packages');
