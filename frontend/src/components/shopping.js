import { useState, useEffect } from "react"
import {Button, Container, Card, Modal } from "react-bootstrap"

export default function Shopping() {
    const items = [{
            name: "iPhone 14",
            description: "iPhone 14 64GB",
            price: 1400
        },

        {
            name: "iPhone Case",
            description: "iPhone 14 case",
            price: 14
        },

        {
            name: "MSI 27\" monitor",
            description: "27 inch monitor 60hz",
            price: 300
        },

        {
            name: "AirPods",
            description: "Apple AirPods Pro",
            price: 200
        },

        {
            name: "Asus Router",
            description: "Asus Router 2.5g 5g",
            price: 400
        },
    ]

    const [cart, setCart] = useState([])
    const [total, setTotal] = useState(0)
    const [showModal1, setShowModal1] = useState(false)

    const handleCloseModal1 = () => setShowModal1(false)
    const handleShowModal1 = () => setShowModal1(true)

    function removeItem(itemToRemove){ //this removes all duplicate items. change it to a way to only delete element which is clicked; might need to use an ID for each item
        let newArr = []
        cart.map((item) => {if(item.name != itemToRemove.name) newArr.push(item)})
        setCart(newArr)
        setTotal(total - itemToRemove.price)
    }

    function checkout(){

        if(total > 0) {
            fetch("http://localhost:3001/charge", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: "Shopping", description: "Shopping", amount: total})
            })
            .then((res) => res.json())
            .then((data) => {window.location.replace(data.hosted_url)})
            .catch((err) => console.log(err))
        }
    }

    return (
        <div>
            <div className="m-3 d-flex justify-content-end">
                <Button className="" onClick={handleShowModal1} variant="primary"><i class="fa fa-shopping-cart"></i> View Cart</Button>
            </div>
            <Container className="d-flex flex-wrap">
                {items.map((item, index) => (
                    <Card border="light" className="m-3" style={{ width: '18rem' }}>
                        <Card.Img variant="top" src="https://i.fbcd.co/products/original/667ca7502e4e218f01e4fbb26e01e2fc7fe17370f64bf444f60818b9d1b2c2b2.jpg" />
                        <Card.Body>
                            <Card.Title>{item.name}</Card.Title>
                            <Card.Text>
                                {item.description}
                                <br/>
                                <h4>${item.price}</h4>
                            </Card.Text>
                            <Button onClick={() => {setCart(cart.concat(items[index])); setTotal(total + item.price)}} variant="success">Add to cart</Button>
                        </Card.Body>
                    </Card>
                ))}
            </Container>

            <Modal scrollable={true} show={showModal1} onHide={handleCloseModal1} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                <Modal.Title><b>Cart</b></Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {cart.length != 0 ?
                        cart.map((item) => (
                            <Card border="light" className="mt-4">
                                <Card.Body>
                                    <Card.Title>
                                        <div className="d-flex justify-content-between">
                                            {item.name}
                                            <h4>${item.price}</h4>
                                        </div>
                                    </Card.Title>
                                    <Card.Text>
                                        {item.description}
                                    </Card.Text>
                                    <Button onClick={() => removeItem(item)} size="sm" variant="danger">Remove</Button>            
                                </Card.Body>
                            </Card> 
                        ))
                        : 
                        <div className="text-center">
                            <img width="100px" height="100px" src="https://cdn3.iconfinder.com/data/icons/shopping-and-ecommerce-29/90/empty_cart-512.png"></img>
                            <h3 className="text-muted">Cart Empty</h3>                                                                                       
                        </div>
                    }
                </Modal.Body>

                <Modal.Footer className="d-flex justify-content-between">
                    <div className="d-block">
                        <h4 className="text-muted">Total</h4>
                        <h4>${total}</h4>
                    </div>

                    <div>
                        <Button className="m-2" variant="danger" onClick={handleCloseModal1}>Close</Button>
                        <Button disabled={total == 0 ? true : false} variant="success" onClick={checkout}>Checkout</Button>                                                                    
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    )
}