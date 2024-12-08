import chalk from 'chalk';

const _log = (message: string) => {
  console.log(message);
};

const logger = (message: string) => {
  _log(message);
};

logger.success = (message: string) => {
  _log(`✅ ${chalk.green(message)}`);
};

logger.info = (message: string) => {
  _log(`ℹ️  ${chalk.blue(message)}`);
};

logger.warn = (message: string) => {
  _log(`⚠️  ${chalk.yellow(message)}`);
};

logger.error = (message: string) => {
  _log(`❌ ${chalk.bgRed(message)}`);
};

logger.chore = (message: string) => {
  _log(`🧹 ${chalk.grey(message)}`);
};

export { logger };
