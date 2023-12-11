const express = require("express")
require("./core/db/connect")
const docApi = require("./core/api/docApi")
const stsApi = require("./core/api/stsApi")

const app = express()
const PORT = 8011

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/doc', docApi)
app.use('/api/sts', stsApi)

app.listen(PORT, () => {
  console.log(`server works on port:${PORT}`)
})