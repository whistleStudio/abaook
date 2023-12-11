const mongoose = require('mongoose');
const DbName = 'abaook'
const PORT = 27017

main().catch(err => console.log(err));

async function main() {
  // await mongoose.connect(`mongodb://localhost:${PORT}/${DbName}`, {user:'whistle', pass:'19930304wsh'});
  await mongoose.connect(`mongodb://wsh:19930304wsh@127.0.0.1:${PORT}/${DbName}`);

  console.log(`db:${DbName} connected on port:${PORT}`)
}