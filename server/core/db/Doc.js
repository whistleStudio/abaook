const mongoose = require('mongoose')

const docSchema = new mongoose.Schema({
  title: String,
  author: {type: String, default: "abao"},
  tag: {type: String, default: ""},
  cate: {type: Number, default: 0},
  content: String,
  createDate: {type: Date, default: new Date()},
  editDate: {type: Date, default: new Date()}
})
const Doc = mongoose.model('docs',docSchema)

module.exports = Doc