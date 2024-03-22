import { getPosts } from "../../services";

export default async function handler(req, res) {
    
    const posts = await getPosts();
    res.status(200).json(posts);
}