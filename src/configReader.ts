import Config = require('./interfaces/config');

function read(configPath: string): Config {
  return require(configPath);
}

export { read };
