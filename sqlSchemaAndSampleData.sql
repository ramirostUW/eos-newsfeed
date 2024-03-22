drop table if exists Article;
drop table if exists Category;
drop table if exists Author;
drop table if exists Admin;

create Table Admin (email varchar(256) primary key);

create Table Author (name varchar(256) not null, photoURL text, slug varchar(256) primary key, email varchar(256) not null unique);

create Table Category (name varchar(256) not null, slug varchar(256) primary key);

create Table Article (title varchar(256) not null, excerpt text, articleURL text not null, slug varchar(256) primary key, featuredImageURL text, createdAt date, authorSlug varchar(256) references Author(slug) not null, categorySlug varchar(256) references Category(slug) ON DELETE CASCADE not NULL);

Insert into Admin  (email) values ('ramirost@uw.edu');

Insert into Author  (name, photoURL, slug, email) values ('Ramiro Steinmann Petrasso', 'https://avatars.githubusercontent.com/u/59666336', 'ramiro-petrasso', 'ramirost@uw.edu')

Insert into Category  (name, slug) values ('District Administration', 'district-admin')
Insert into Category  (name, slug) values ('Standardized Testing', 'standard-test')

Insert into Article (title, excerpt, articleURL, slug, featuredImageURL, createdAt, authorSlug, categorySlug) values ('AP Exams: The Top 10 Most Requested Subjects (and the Least Requested)', 'Also see how widely requested two new AP courses were this year.', 'https://www.edweek.org/teaching-learning/ap-exams-the-top-10-most-requested-subjects-and-the-least-requested/2024/01', 'test-post-2', 'https://epe.brightspotcdn.com/dims4/default/f3e2596/2147483647/strip/true/crop/3000x2002+0+0/resize/944x630!/quality/90/?url=https%3A%2F%2Fepe-brightspot.s3.us-east-1.amazonaws.com%2F4b%2Fee%2F5e626a1f4895845b6c4d7406af1e%2Ftesting-012024-495639272.jpg', '02-19-2024', 'ramiro-petrasso', 'standard-test')
Insert into Article (title, excerpt, articleURL, slug, featuredImageURL, createdAt, authorSlug, categorySlug) values ('A Roadmap to Help Men of Color Thrive as Leaders at Their Schools and Districts', 'How 2 district leaders are cultivating the next generation through mentorship and support in Atlanta and L.A. — and how your district can, too.', 'https://www.the74million.org/article/a-roadmap-to-help-men-of-color-thrive-as-leaders-at-their-schools-and-districts/', 'test-post-3', 'https://www.the74million.org/wp-content/uploads/2024/02/Nava-Hunter-Headshot-825x495.jpg?cb=721664', 'Feb 18, 2024', 'ramiro-petrasso', 'district-admin')



Select * from Article;
