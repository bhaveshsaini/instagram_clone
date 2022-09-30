import { useState, useEffect } from "react"
import { Button, Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
 
import "../css/createpost.css"

export default function CreatePost(user, setAlert) {
    const [caption, setCaption] = useState("")
    const [file, setFile] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            setAlert({variant: "danger", message: "Please sign in"})
            navigate("/login")
        }
    }, [user])

    function uploadFile(e) {
        setFile(e.target.files[0])
    }

    function makePost() {
        const formData = new FormData()
        formData.append('user', user)
        formData.append('caption', caption)
        formData.append('file', file)
        const requestOptions = {
            method: "POST",
            body: formData
        }

        fetch("/createPost", requestOptions).then((res) => {
            navigate("/")
        })
        .catch((e) => console.log(e))
    }

    return (
        <Form className="post-form">
            <div className="create-post">
                <Form.Group className="mb-3">
                    <img src={file ? URL.createObjectURL(file) : null} className="post-image"/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <input type="file" accept="image/*" onChange={uploadFile}/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control 
                        type="text" 
                        placeholder="Enter a caption" 
                        onInput={(e) => setCaption(e.target.value)}>
                    </Form.Control>
                </Form.Group>

                <div className="post-button-wrapper">
                    <Button variant="primary" type="button" onClick={makePost} className="post-button">Post</Button>
                </div>
            </div>
        </Form>
    )
}