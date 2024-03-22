
const sql_server_user = process.env.DB_USER;
const sql_server_password = process.env.DB_PASSWORD;
const sql_server_server = process.env.DB_SERVER;
const sql_server_port = Number(process.env.DB_PORT);
const sql_server_database = process.env.DB_NAME;


export const revalidateHomepage = (res) => {
  console.log("Trying to Revalidate Homepage");
  res.revalidate('/');
}

export const grabCategoriesFromAPI = async () => {
  fetch('/api/grabCategories')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

export const getPosts = async () => {
  const myQuery = `Select Article.title, Article.excerpt, Article.articleURL, Article.slug, Article.featuredImageUrl, Convert(char, Article.createdAt) as createdAt, Author.name as authorName, Author.photoURL as authorPhotoUrl, Category.slug as categorySlug from Article 
    Inner join Author on Article.authorSlug = Author.slug
    Inner join Category on Article.categorySlug = Category.slug
    Order by Article.createdAt DESC;`
    
  return queryDB(myQuery);
}

export const getCategoryPosts = async (slug) => {
  const myQuery = `Select Article.title, Article.excerpt, Article.articleURL, Article.slug, Article.featuredImageUrl, Convert(char, Article.createdAt) as createdAt, Author.name as authorName, Author.photoURL as authorPhotoUrl from Article 
    Inner join Author on Article.authorSlug = Author.slug
    Inner join Category on Article.categorySlug = Category.slug
    where Article.categorySlug = @myParam
    Order by Article.createdAt DESC;`
  return queryDBWithSingleParam(myQuery, slug);
}

export const getAuthorInfo = async (email) => {
  const myQuery = `Select Author.name as authorName, Author.slug as authorSlug, Author.photoURL as authorPhotoUrl, Author.email as authorEmail from 
  Author where Author.email = @myParam`
  return queryDBWithSingleParam(myQuery, email);
}

export const getAdminInfo = async (email) => {
  const myQuery = `Select email from 
  Admin where Admin.email = @myParam`
  return queryDBWithSingleParam(myQuery, email);
}


export const getRecentPosts = async () => {
  const myQuery = `Select Top 2 Article.title, Article.excerpt, Article.articleURL, Article.slug, Article.featuredImageUrl, Convert(char, Article.createdAt) as createdAt, Author.name as authorName, Author.photoURL as authorPhotoUrl from Article 
  Inner join Author on Article.authorSlug = Author.slug
  Inner join Category on Article.categorySlug = Category.slug
  Order by Article.createdAt DESC;`
  return queryDB(myQuery);
}

export const getCategories = async () => {
  const myQuery = `Select name, slug from Category;`
  return queryDB(myQuery);
}

const queryDB = async (sqlQuery) => {
  const sql = require('mssql');

  const config = {
    user: sql_server_user,
    password: sql_server_password,
    server: sql_server_server,
    port: sql_server_port, 
    database: sql_server_database,
    authentication: {
      type: 'default'
    },
    options: {
      encrypt: true
    }
  }


  try {
    var poolConnection = await sql.connect(config);

    var resultSet = await poolConnection.request().query(sqlQuery);

    // output column headers
    poolConnection.close();
    //console.log(resultSet.recordset)
    var returnedPosts = resultSet.recordset
    return returnedPosts;
    // close connection only when we're certain application is finished

  } catch (err) {
    console.error(err.message);
  }
}

const queryDBWithSingleParam = async (sqlQuery, myParam) => {
  const sql = require('mssql');

  const config = {
    user: sql_server_user,
    password: sql_server_password,
    server: sql_server_server,
    port: sql_server_port, 
    database: sql_server_database,
    authentication: {
      type: 'default'
    },
    options: {
      encrypt: true
    }
  }


  try {
    var poolConnection = await sql.connect(config);

    var resultSet = await poolConnection.request().input('myParam', sql.VarChar, myParam).query(sqlQuery);

    // output column headers
    poolConnection.close();
    //console.log(resultSet.recordset)
    var returnedPosts = resultSet.recordset
    console.log("Queried for values:");
    console.log(returnedPosts);
    return returnedPosts;
    // close connection only when we're certain application is finished

  } catch (err) {
    console.error(err.message);
  }
}

export const InsertOrDelFromDB = async (sqlQuery, queryParams, onSuccess, onErr) => {
  var Connection = require('tedious').Connection;
  var config = {
    server: sql_server_server,
    authentication: {
      type: 'default',
      options: {
        userName: sql_server_user, //update me
        password: sql_server_password //update me
      }
    },
    options: {
      // If you are on Microsoft Azure, you need encryption:
      encrypt: true,
      database: sql_server_database
    }
  };
  var connection = new Connection(config);
  connection.on('connect', function (err) {
    // If no error, then good to proceed.  
    //console.log("Connected");
    executeStatement1();
  });

  await connection.connect();

  var Request = require('tedious').Request
  var TYPES = require('tedious').TYPES;

  function executeStatement1() {
    var request = new Request(sqlQuery, function (err) {
      if (err) {
        onErr(err);
      }
    });

    //console.log("queryParams: ");
    //console.log(queryParams);
    for (const paramKey in queryParams) {
      const paramVal = queryParams[paramKey]
      var paramType = TYPES.NVarChar;
      if(paramVal === undefined){
        paramType = TYPES.Null;
      }
      request.addParameter(paramKey, paramType, paramVal);
    }

    request.on("requestCompleted", function (rowCount, more) {
      connection.close();
      //console.log(request);
      onSuccess();
    });
    connection.execSql(request);
  }
}