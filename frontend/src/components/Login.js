import { useState } from "react"
import { Form, Button } from "react-bootstrap"
import { useNavigate, Link } from "react-router-dom"

export default function Login({setAlert, setUser}) {
    const [username, setUsername] = useState("")
    const navigate = useNavigate()

    function handleLogin(e) {
        fetch("/getProfile?user=" + username)
        .then((res) => res.json())
        .then((data) => {
            if (data.length > 0) {
                setAlert({variant: "success", message: "successfully logged in"})
                setUser(data[0].username)
                navigate("/")
            }
            else{
                setAlert({variant: "danger", message: "No user found"})
            }
        }).catch((e) => setAlert({variant: "danger", message: e}))
    }

    return (
    <Form className="center-form">
        <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control 
                type="text" 
                placeholder="Username" 
                onInput={(e) => {
                    setUsername(e.target.value)
                }
            }/>
            <small className="form-text text-muted">Don't have an account? <Link to="/sign-up">Create account</Link></small>
        </Form.Group>

        <Button variant="primary" type="button" onClick={handleLogin}>Login</Button>
    </Form>
);}