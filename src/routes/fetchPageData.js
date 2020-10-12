const router = require("express").Router()
const UserPage = require("../models/userPage")

router.post("/", async (req, res) => {
  try {
    const uid = req.body.uid
    await UserPage.findOne({"ownerID": uid})
    .then(pageData => {
      if(pageData) {
        return res.status(200).json({pageData})
      } else {
        return res.status(400).json({"error": "User does not exist"})
      }
    })
    .catch(err => {
      res.status(500).json({"error": err.message})  
    })
  } catch(err) {
    res.status(500).json({"error": err.message})  
  }
})

module.exports = router