# EOS Newsfeed

Ramiro Steinmann Petrasso, Marques Chacon, Peter Mohammadi

## About

This project was made by a group of students in the UW MSDS Program, during the Autumn 2023-Winter 2024 Quarters. It is part of a capstone project sponsored by [Equal Opportunity Schools, or EOS](https://eoschools.org/). This project is a website that serves as a News Feed, meant to allow EOS administration to post links to it that contain information on the use of data in the field of education. The general idea is that administration will post useful articles and papers at regular intervals (IE every month, or twice a month) and that employees will know to take a look at the site at those intervals to get caught up to speed. This project is meant to help provide a single central place where this information can be found, to avoid having to require employees to look in different places, as well as to make sure each individual link is seen by as many as possible.

## Technical Description

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). It relies on a standard SQL Server relational database, and needs both read and write access to this database. It also uses Microsoft Authentication when verifying users that are trying to upload links.

Next.JS was used because of its ability to house both a React frontend as well as a series of Express.js-style API routes, allowing for both to be hosted on the same container/Docker image and minimizing the need to use several different code repositories.


## Getting Started

To run this code, you'll need to first create a [SQL Server database instance](https://learn.microsoft.com/en-us/sql/relational-databases/databases/create-a-database?view=sql-server-ver16) (we recommend doing so with [Azure SQL](https://azure.microsoft.com/en-us/products/azure-sql/database)), as well as [register an application with Microsoft](https://learn.microsoft.com/en-us/entra/identity-platform/tutorial-single-page-app-react-register-app), so that this site can use authentication.

Once the database is up and running, run the .sql file in the root of this code repository, "sqlSchemaAndSampleData.sql", to both set up the database's schema as is required by this site to operates, as well as to get some sample posts that the website can display.

Afterward, fill out this .env template with the corresponding values and save it to the root of this repository (as .env.local):

```
DB_USER=****
DB_PASSWORD=****
DB_SERVER=****
DB_PORT=****
DB_NAME=****

NEXT_PUBLIC_AZURE_AD_CLIENT_ID=****
NEXT_PUBLIC_AZURE_AD_TENANT_ID=common
```

Once all this is complete, you can now run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:1234](http://localhost:1234) with your browser to see the result.
