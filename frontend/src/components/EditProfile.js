import { useState, useEffect } from "react"
import { Modal, Button, Form} from "react-bootstrap"

export default function EditProfile(show, hideCallback, user, profileData) {
    const [bio, setBio] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [file, setFile] = useState("")

    useEffect(() => {
        setFirstName(profileData.first_name)
        setLastName(profileData.last_name)
        setBio(profileData.bio)
    }, [profileData])

    function updateProfile() {

        const formData = new FormData()
        formData.append("file", file)
        formData.append("user", user)
        formData.append("first_name", firstName)
        formData.append("last_name", lastName)
        formData.append("bio", bio)
        const requestOptions = {
            method: "POST",
            body: formData
        }

        fetch("/updateProfile", requestOptions)
        .then((res) => res.json())
        .then((data) => {
            console.log("Profile updated")
            if(file) data.image_url = URL.createObjectURL(file)
            hideCallback()
        })
        .catch((err) => console.log(err))
    }

    return <Modal show={show} onHide={hideCallback}>
        <Modal.Header closeButton>
            <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <Form>
                <Form.Group className="mb-3">
                    {profileData.photo && !file ? <img src={profileData.photo.asset.url} className="upload-image"/> : <img src={file ? URL.createObjectURL(file) : null} className="upload-image" />}
                </Form.Group>

                <Form.Group className="mb-3">
                    <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])}/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="First Name" defaultValue={profileData.first_name} onInput={(e) => setFirstName(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="Last Name" defaultValue={profileData.last_name} onInput={(e) => setLastName(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="Bio" defaultValue={profileData.bio} onInput={(e) => setBio(e.target.value)}/>
                </Form.Group>

                <div>
                    <Button variant="primary" onClick={updateProfile}>Save</Button>
                </div>
            </Form>
        </Modal.Body>
    </Modal>
}