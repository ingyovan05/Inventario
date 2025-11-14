const { spawn } = require('child_process');

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || '4200';

const ngPath = require.resolve('@angular/cli/bin/ng');
const args = [ngPath, 'serve', '--host', host, '--port', port];

const child = spawn('node', args, { stdio: 'inherit', shell: false });
child.on('exit', (code) => process.exit(code ?? 0));

