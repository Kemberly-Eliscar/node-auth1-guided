// middleware is just a function that exports a function. 
// middleware returns some express middleware which is just 
// a function that defines the request, response and next
// then we just need to export it so we can import it into our router
// make it an async function
// write a try, catch error

const bcrypt = require("bcryptjs")
const Users = require('../users/users-model')



// first thing we have to do is get the username and password value from the header
// second thing we want to do is make sure those values aren't empty.
function restrict(){
    // put in "error message" variable so we can re-use it
    const authError = {
        message: "Invalid credentials",
    }

    return async (req, res, next) => {
        try {
            const { username, password } = req.headers
            // make sure the values aren't empty but writing an if statement
            // if there is no username of password
            // then return a 401 status
            if (!username || !password) {
                return res.status(401).json(authError)
            }
            console.log("checkpoint 1")

            // next thing we need to do is get the user from the database
            // import user's model up top
            const user = await Users.findBy({ username }).first()

            // make sure the user exists
            //if that user is undefined, return an error
            if (!user){
                return res.status(401).json(authError)
            }
            console.log("checkpoint 2")

            const passwordValid = await bcrypt.compare(password, user.password)

            // make sure the password is correct
            if (!passwordValid) {
                return res.status(401).json(authError)
            }
            console.log("checkpoint 3")

            // if we reach this point, the user is authenticated!
            next() // next will allow us to move on to the next middleware function. 
        } catch(err) {
            next(err)
        }
    }
}

module.exports = restrict