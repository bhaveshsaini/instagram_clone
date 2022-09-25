import sanityClient from "./client.js"

const functions = {}

functions.createUser = (firstName, lastName, userName) => {
    return sanityClient.create({
        _type: "user",
        first_name: firstName,
        last_name: lastName,
        username: userName,
        created_at: new Date()
    })
}

export default functions