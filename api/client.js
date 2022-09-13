import { SanityClient } from "@sanity/client"
import dotenv from "dotenv"
dotenv.config()

export default SanityClient()({
    projectId: "x5e3rut6",
    dataset: "production",
    usecdn: false,
    apiVersion: "2022-02-22",
    token: process.env.SANITY_API_TOKEN,
})

