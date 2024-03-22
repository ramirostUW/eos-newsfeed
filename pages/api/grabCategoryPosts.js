import { getCategoryPosts } from "../../services";

export default async function handler(req, res) {
    
    let slug = req.query.slug;
    const categories = await getCategoryPosts(slug);
    res.status(200).json(categories);
}