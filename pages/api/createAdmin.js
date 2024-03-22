import { InsertOrDelFromDB } from "../../services"

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {

  const insertQuery = "Insert into Admin (email) values (@email);"

  Object.keys(req.body).forEach(paramKey => req.body[paramKey] = req.body[paramKey] === '' ? null : req.body[paramKey])

  console.log(req.body);

  const paramList = {
    'email': req.body.email
  }

  const successFunc = () => {
    res.status(200).json({ message: 'Request seems to have been successful.' });
  }

  const errorFunc = (err) => {
    console.log(err);
    var returnObj = {...err};
    returnObj.message = err.toString();
    res.status(400).json(returnObj);
  }

  InsertOrDelFromDB(insertQuery, paramList, successFunc, errorFunc);  
}
