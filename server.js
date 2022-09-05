// response times should be kept under 100/200 ms

const express = require('express');
const cluster = require('cluster');
const os = require('os');


const app = express();

function delay(duration) {
  const startTime = Date.now();
  while (Date.now() - startTime < duration) {
    // the event loop is now blocked...
  }
}

app.get('/', (req, res) => {
  res.send(`Performance example: ${process.pid}`);
});

app.get('/timer', (req, res) => {
  delay(9000);
  res.send(`The alarm bells are ringing!: ${process.pid}`);
})

if (cluster.isMaster) {
  console.log('Master has been started');
  const NUM_WORKERS = os.cpus().length;
  for (let i = 0; i < NUM_WORKERS; i++) {
    cluster.fork();
  }
} else {
  console.log('Worker process has been started');
  app.listen(3000);
}

