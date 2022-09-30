import sanityClient from "./client.js"
import { createReadStream } from "fs"
import { basename } from "path"

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

functions.getProfile = (user) => {
    return sanityClient.fetch(`*[_type == "user" && username == $username]
    {
        ...,
        "following": count(following),
        "followers": *[_type == "user" && references(^._id)],
        photo{
            asset->{
                _id,
                url
            }
        }
    }`, {username: user})
}

functions.getUserId = (user) => {
    // const ret = 
    return sanityClient.fetch(`*[_type == "user" && username == $username]{
        _id
    }`, {username: user})

    // return ret 
    // RETURNING EMPTY RESPONSE
}

functions.createPost = (user, caption, image) => {
    return sanityClient.assets.upload("image", createReadStream(image.path), {
        filename: basename(image.path)
    }).then((data) => functions.getUserId(user).then((ids) => {
        const id = ids[0]._id
        return sanityClient.create({
            _type: "post",
            author: {_ref: id},
            photo: {asset: { _ref: data._id}},
            description: caption,
            create_at: new Date()
        })
    }))
}

export default functions