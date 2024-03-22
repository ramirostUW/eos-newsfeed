import { getAuthorInfo } from "../../services";

export default async function handler(req, res) {
    
    let email = req.query.email;
    const categories = await getAuthorInfo(email);
    console.log(categories)
    res.status(200).json(categories);
}