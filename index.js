const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');

function make(command) {
  exec(command, { encoding: 'utf8' }, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return;
    }
    // console.log(`stdout: ${stdout}`);
    // console.log(`stderr: ${stderr}`);
  });
}

function nameFileter(name) {
  return name.replaceAll('|', '');
}

function getNewFilePath(pathName) {
  return path.join(os.homedir(), `Music`, `${nameFileter(pathName)}.mp4`);
}

function main() {
  const files = fs.readdirSync(__dirname);
  for (var i = files.length - 1; i >= 0; i--) {
    const file = files[i];
    if (fs.lstatSync(file).isDirectory()) {
      const files2 = fs.readdirSync(file);
      const f1 = files2[0];
      const data = fs.readFileSync(
        path.join(__dirname, file, f1, 'entry.json'),
        'utf8',
      );
      const json = JSON.parse(data);
      const f2s = fs.readdirSync(path.join(__dirname, file, f1));
      const f2 = f2s.find((name) => {
        return !isNaN(Number(name));
      });
      const f = (name) => path.join(__dirname, file, f1, f2, name);
      make(
        `ffmpeg -i ${f('video.m4s')} -i ${f(
          'audio.m4s',
        )} -c:v copy -strict experimental "${getNewFilePath(json.title)}"`,
      );
    }
  }
}

main();
