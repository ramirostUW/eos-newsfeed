import { getAdminInfo } from "../../services";

export default async function handler(req, res) {
    
    let email = req.query.email;
    const categories = await getAdminInfo(email);
    console.log(categories)
    res.status(200).json(categories);
}