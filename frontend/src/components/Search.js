import { useState } from "react"
import { Form, Button, ListGroup, Card } from "react-bootstrap"
import ProfileItem from "./ProfileItem.js"
import "../css/Search.css"

export default function Search() {
    const [searchText, updateSearchText] = useState("")
    const [searchResults, updateSearchResults] = useState([])

    function search() {
        fetch("/searchForUsername?text=" + searchText)
        .then((res) => res.json())
        .then((data) => updateSearchResults(data))
        .catch((err) => console.log(err))
    }

    return (
    <div className="search">
        <div className="search-wrapper">
            <Form className="search-form">
                <Form.Group className="search-field">
                    <Form.Control type="text" onInput={(e) => updateSearchText(e.target.value)} placeholder="Search for a user"/>
                </Form.Group>

                <Button variant="primary" className="ms-2" onClick={search}>Search</Button>
            </Form>

            {searchResults.length > 0 ? 
                (<div className="search-results-wrapper">
                    <Card style={{width: "100%"}}>
                    <ListGroup variant="flush">
                        {searchResults.map((item, idx) => (
                        <ProfileItem {...item} idx={idx} />
                        ))}
                    </ListGroup>
                    </Card>
                </div>) : <h1> No results</h1>
            }
        </div>
    </div>
    )
}