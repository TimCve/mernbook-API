const router = require("express").Router()
const user = require("../models/user")
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

router.post("/", async (req, res) => {
  try {
    const filter = req.body.filter
    let posterId = ""

    try {
      if(req.header("x-auth-token") && req.header("x-auth-token") != undefined) {
        posterId = jwt.verify(req.header("x-auth-token"), process.env.JWT_SECRET).id
      }
    } catch(err) {}

    if(posterId) {
      if(req.body.filter) {
        await User.find({"displayName": {$regex: new RegExp(filter, "i")}, "_id": {"$ne": mongoose.Types.ObjectId(posterId)}})
        .then(users => {
          let userList = []
          for(let i = 0; i < users.length; i++) {
            userList.push({"uid": users[i]._id, "uname": users[i].displayName})
          }
          res.status(200).json({"users": userList})
        })
      } else {
        await User.find({"_id": {"$ne": mongoose.Types.ObjectId(posterId)}})
        .then(users => {
          let userList = []
          for(let i = 0; i < users.length; i++) {
            userList.push({"uid": users[i]._id, "uname": users[i].displayName})
          }
          res.status(200).json({"users": userList})
        })
      }
    } else {
      if(req.body.filter) {
        await User.find({"displayName": {$regex: new RegExp(filter, "i")}})
        .then(users => {
          let userList = []
          for(let i = 0; i < users.length; i++) {
            userList.push({"uid": users[i]._id, "uname": users[i].displayName})
          }
          res.status(200).json({"users": userList})
        })
      } else {
        await User.find()
        .then(users => {
          let userList = []
          for(let i = 0; i < users.length; i++) {
            userList.push({"uid": users[i]._id, "uname": users[i].displayName})
          }
          res.status(200).json({"users": userList})
        })
      }
    }
  } catch(err) {
    res.status(500).json({"error": err.message})  
  }
})

module.exports = router