import { InsertOrDelFromDB, revalidateHomepage } from "../../services"

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {

  const deleteQuery = "Delete from Category where slug = @slug ;"

  console.log(req.body);
  const paramList = {
    'slug': req.body.slug
  }

  const successFunc = () => {
    revalidateHomepage(res);
    res.status(200).json({ message: 'Request seems to have been successful.' });
  }

  const errorFunc = (err) => {
    console.log(err);
    var returnObj = {...err};
    returnObj.message = err.toString();
    res.status(400).json(returnObj);
  }

  InsertOrDelFromDB(deleteQuery, paramList, successFunc, errorFunc);  
}
