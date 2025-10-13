#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Attempt to run the local Python server script.
const serverPath = resolve(__dirname, '..', 'server.py');

const child = spawn(process.env.PYTHON || 'python3', [serverPath], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});

