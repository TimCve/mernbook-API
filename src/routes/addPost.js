const router = require("express").Router()
const UserPage = require("../models/userPage")
const auth = require("../middleware/auth")

router.post("/", auth, async (req, res) => {
  try {
    const title = req.body.title
    const content = req.body.content
    const uid = req.user

    let existingPosts = []

    await UserPage.findOne({"ownerID": uid})
    .then(async page => {
      if(page) {
        existingPosts = page.posts
        const newPost = {
          "title": title,
          "content": content
        }
        existingPosts.push(newPost)
        await UserPage.updateOne({"ownerID": uid}, {
          posts: existingPosts
        })
        .then(() => {
          res.status(200).json({"msg": "Post successfully added!"})
        })
        .catch(err => {
          return res.status(500).json({"error": err.message})  
        })
      } else {
        return res.status(404).json({"msg": "Page not found"})
      }
    })
    .catch(err => {
      return res.status(500).json({"error": err.message})  
    })
  } catch(err) {
    return res.status(500).json({"error": err.message})  
  }
})

module.exports = router