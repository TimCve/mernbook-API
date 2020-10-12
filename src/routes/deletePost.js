const router = require("express").Router()
const UserPage = require("../models/userPage")
const auth = require("../middleware/auth")

router.post("/", auth, async (req, res) => {
  try {
    const postId = req.body.postId
    const uid = req.user

    let existingPosts = []

    await UserPage.findOne({"ownerID": uid})
    .then(async page => {
      if(page) {
        existingPosts = page.posts

        function findPostIndex() {
          for(let i = 0; i < existingPosts.length; i++) {
            if(existingPosts[i]._id == postId) {
              return i
            }
          }
        }
        
        const index = findPostIndex()
        
        if(index > -1) {
          existingPosts.splice(index, 1)
        } else {
          return res.status(401).json({"msg": "Post not found"})
        }

        await UserPage.updateOne({"ownerID": uid}, {
          posts: existingPosts
        })
        .then(() => {
          res.status(200).json({"msg": "Post successfully removed!"})
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