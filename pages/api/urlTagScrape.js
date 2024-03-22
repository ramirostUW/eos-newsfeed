import fetch from 'node-fetch';
import parser from 'node-html-parser';

export default async function handler(req, res) {
  let url = req.query.url;
  await fetch(url)
    .then(response => response.text())
    .then(function (pagetext) {
      let htmlPage = parser.parse(pagetext);
      let metaTags = htmlPage.querySelectorAll("meta");
      let metaInfo = {};
      for (let i = 0; i < metaTags.length; i++) {
        let tag = metaTags[i];
        let property = tag.attributes["property"];
        if (property !== undefined) {
          metaInfo[property] = tag.attributes["content"];
        }

      }
      if (metaInfo["og:url"] === undefined) {
        metaInfo["og:url"] = url
      }
      if (metaInfo["og:title"] === undefined && htmlPage.querySelector("title")) {
        let titleTag = htmlPage.querySelector("title").innerHTML
        metaInfo["og:title"] = titleTag
      }
      if (metaInfo["og:title"] === undefined) {
        metaInfo["og:title"] = url
      }
      res.status(200).json(metaInfo)
    })
    .catch(function (error) {
      //res.status(400).json({ errorMsg: error.toString()})
      res.status(400).send(error.toString())
    });
}
