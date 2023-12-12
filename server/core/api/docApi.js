const express = require("express")
const rt = express.Router()
const Doc = require("../db/Doc")

/* 保存 */
rt.post("/save", (req, res) => {
  console.log(req.body)
  const {content, curPageNum} = req.body
  ;(async () => {
    try {
      const doc = await Doc.findOne({pageNum: curPageNum})
      if (doc) await Doc.updateOne({pageNum: curPageNum}, {content}) //有 - 更新
      else await Doc.create({content, pageNum: curPageNum})
      res.json({err: 0})
    } catch(e){res.json({err: 5})}
  })()
})

/* 获取 */
rt.get("/getContent", (req, res) => {
  const {pageNum} = req.query
  ;(async () => {
    const doc = await Doc.findOne({pageNum})
    if (doc) res.json({err:0, content: doc.content})
    else res.json({err: -1})
  })()
})

/* 插入 */
rt.get("/insertNote", (req, res) => {
  const {curPageNum} = req.query
  ;(async () => {
    try {
      await Doc.updateMany({pageNum: {$gte: curPageNum}}, {$inc: { pageNum: 1 }})
      res.json({err: 0})
    } catch(e) {res.json({err: 5})}
  })()
})

module.exports = rt