// require cose otherwise it need to be preloaded with commandline command
require('dotenv').config()

const cfg: any = {}
// port for the applocation
cfg.port = process.env.PORT
// mongo connection url
cfg.mongoUrl = process.env.MONGO_URL

export { cfg }