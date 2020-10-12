const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("./cleanupBlacklistedTokens")
require("./cleanupExpiredRefreshTokens")
require("dotenv/config")

const registerRoute = require("./routes/register")
const loginRoute = require("./routes/login")
const deleteUserRoute = require("./routes/deleteUser")
const tokenIsValidRoute = require("./routes/tokenIsValid")
const refreshTokenRoute = require("./routes/refreshToken")
const logoutRoute = require("./routes/logout")
const getAllUsersRoute = require("./routes/getAllUsers")
const fetchPageDataRoute = require("./routes/fetchPageData")
const addPostRoute = require("./routes/addPost")
const deletePostRoute = require("./routes/deletePost")

const app = express()
app.use(express.json())
app.use(cors())
const PORT = process.env.PORT || 5000

app.use("/auth/register", registerRoute)
app.use("/auth/login", loginRoute)
app.use("/auth/deleteUser", deleteUserRoute)
app.use("/auth/tokenisvalid", tokenIsValidRoute)
app.use("/auth/refreshtoken", refreshTokenRoute)
app.use("/auth/logout", logoutRoute)

app.use("/fetchdata/getallusers", getAllUsersRoute)
app.use("/fetchdata/fetchPageData", fetchPageDataRoute)

app.use("/alterpage/newpost", addPostRoute)
app.use("/alterpage/deletepost", deletePostRoute)

mongoose.connect(
	process.env.DB_CONNECTION,
	{ useUnifiedTopology: true, useNewUrlParser: true },
	() => {
		console.log("Connected to DB")
	})

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`)
})