const express = require("express")
const rt = express.Router()
const Doc = require("../db/Doc")

/* 保存-新增插入页/修改已有页 */
rt.post("/save", (req, res) => {
  console.log(req.body)
  const {content, curPageNum, isInserted} = req.body
  ;(async () => {
    try {
      if (isInserted) {
        await Doc.updateMany({pageNum: {$gte: curPageNum}}, {$inc: { pageNum: 1 }})
        await Doc.create({content, pageNum: curPageNum})
      } else {
        await Doc.updateOne({pageNum: curPageNum}, {content})
      }
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
    } catch(e) {console.log("insert err:", e);res.json({err: 5})}
  })()
})

/* 取消插入 */
rt.get("/cancelInsertNote", (req, res) => {
  const {curPageNum} = req.query
  ;(async () => {
    try {
      await Doc.updateMany({pageNum: {$gte: curPageNum}}, {$inc: { pageNum: -1 }})
      res.json({err: 0})
    } catch(e) {console.log("cancel insert err:", e); res.json({err: 5})}
  })()
})

/* 删除 */
rt.get("/delNote", (req, res) => {
  const {curPageNum} = req.query
  ;(async () => {
    try {
      await Doc.deleteOne({pageNum: curPageNum})
      await Doc.updateMany({pageNum: {$gte: curPageNum}}, {$inc: { pageNum: -1 }})
      res.json({err: 0})
    } catch(e) {console.log("delete err:", e); res.json({err: 5})}
  })()
})
module.exports = rt