const logger = require('./utils/logger')
const config = require('./utils/confiq')
const app = require('./app')

const PORT = config.PORT;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});