import { useState } from "react"
import {Button, Container, Card, Modal } from "react-bootstrap"

export default function Shopping() {
    const items = [{
            name: "iPhone 14",
            description: "iPhone 14 64GB",
            price: "$1400"
        },

        {
            name: "iPhone Case",
            description: "iPhone 14 case",
            price: "$14"
        },

        {
            name: "MSI 27\" monitor",
            description: "27 inch monitor 60hz",
            price: "$300"
        },

        {
            name: "AirPods",
            description: "Apple AirPods Pro",
            price: "$200"
        },

        {
            name: "Asus Router",
            description: "Asus Router 2.5g 5g",
            price: "$400"
        },
    ]

    const [cart, setCart] = useState([{}])

    function addToCart(itemIndex) {
        setCart(items[itemIndex])
    }

    return (
        <div>
            <Container className="d-flex flex-wrap">
                {items.map((item, index) => (
                    <Card className="m-3" style={{ width: '18rem' }}>
                        <Card.Img variant="top" src="https://i.fbcd.co/products/original/667ca7502e4e218f01e4fbb26e01e2fc7fe17370f64bf444f60818b9d1b2c2b2.jpg" />
                        <Card.Body>
                            <Card.Title>{item.name}</Card.Title>
                            <Card.Text>
                                {item.description}
                                <br/>
                                {item.price}
                            </Card.Text>
                            <Button onClick={() => addToCart(index)} variant="success">Add to cart</Button>
                        </Card.Body>
                    </Card>
                ))}
            </Container>
        </div>
    )
}