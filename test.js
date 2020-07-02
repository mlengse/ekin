const run = require('./run-xvfb')
run(false)

// const { exec } = require('child_process')

// exec('pm2 -v', ( error, stdout, stderr) => {
//   if (error) {
//     console.error(`exec error: ${error}`);
//     return;
//   }
//   console.log(`stdout: ${stdout}`);
//   console.error(`stderr: ${stderr}`);  
// });

// pm2.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`);
// });

// pm2.stderr.on('data', (data) => {
//   console.error(`stderr: ${data}`);
// });

// pm2.on('close', (code) => {
//   console.log(`child process exited with code ${code}`);
// });