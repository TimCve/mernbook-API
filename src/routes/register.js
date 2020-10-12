const router = require("express").Router()
const User = require("../models/user")
const sha256 = require("sha256")
const UserPage = require("../models/userPage")

router.post("/", async (req, res) => {
	try {
		const userInfo = {
			email: req.body.email,
			password: req.body.password,
			passwordCheck: req.body.passwordCheck,
			displayName: req.body.displayName
		}

		await User.findOne({ "email": userInfo.email })
			.then(user => {
				if (user) {
					return res.status(400).json({ msg: "A user with this email already exists" })
				} else {
					if (!userInfo.email || !userInfo.password || !userInfo.passwordCheck) {
						return res.status(400).json({ msg: "Not all required fields have been filled" })
					}
					if (userInfo.password.length < 5) {
						return res.status(400).json({ msg: "Password too short. Must be at least 5 characters" })
					}
					if (userInfo.password !== userInfo.passwordCheck) {
						return res.status(400).json({ msg: "Passwords don't match" })
					}
					if (!userInfo.displayName) {
						userInfo.displayName = userInfo.email
					}

					const newUser = new User({
						"email": userInfo.email,
						"password": sha256.x2(userInfo.password),
						"displayName": userInfo.displayName
					})

					newUser.save()
						.then(async () => {
							await User.findOne({ "email": newUser.email })
							.then(user => {
								const uid = user._id
								const uname = user.displayName
								const newUserPage = new UserPage({
									ownerID: uid,
									ownerDisplayName: uname,
									posts: [
										{
											title: "Welcome to MERNbook!",
											content: "Welcome " + uname + " to MERNbook, my full stack Facebook clone!",
											comments: []
										}
									]
								})
								newUserPage.save()
								.then(() => {
									res.send("Successful registration!")
								})
								.catch(err => {
									res.status(500).json({ "error": err.message })
								})
							})
							.catch(err => {
								res.status(500).json({ "error": err.message })
							})
						})
						.catch(err => {
							res.status(500).json({ "error": err.message })
						})
				}
			})
			.catch(err =>
				res.status(500).json({ error: err.message })
			)
	} catch (err) {
		return res.status(500).json({ error: err.message })
	}
})

module.exports = router