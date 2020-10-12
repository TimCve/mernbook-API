const router = require("express").Router()
const auth = require("../middleware/auth")
const User = require("../models/user")
const UserPage = require("../models/userPage")

router.delete("/", auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user, async (err, user) => {
      if (err){ 
        return res.status(500).json({"error": err.message}) 
      } else {
        if(user) {
          await UserPage.findOneAndDelete({"ownerID": user._id})
          .then(() => {
            return res.status(200).json({"msg": "Successfully deleted user"})
          })
          .catch(err => {
            return res.status(500).json({"error": err.message})  
          })
        } else {
          return res.status(400).json({"msg": "User does not exist"})
        }
      }
    })
  } catch(err) {
    return res.status(500).json({"error": err.message})  
  }
})

module.exports = router