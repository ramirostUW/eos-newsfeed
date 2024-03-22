import { revalidateHomepage } from "../../services"

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {

    revalidateHomepage(res);
    res.status(200).json({ message: 'Request to revalidate has been made.' });

}