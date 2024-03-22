import { useState, useEffect } from 'react';
import Head from "next/head";
import { PostCard, Categories, PostWidget } from "../components";
import { getPosts, getRecentPosts, getCategories } from "../services";


export async function getStaticProps() {
  const propData = {
    posts: (await getPosts() || []),
    recentPosts: (await getRecentPosts() || []),
    categories: (await getCategories() || [])
  }
  return {
    props: { propData }
  }
}


export default function Home({ propData }) {

  const posts = propData.posts;
  const recentPosts = propData.recentPosts;
  const categories = propData.categories;


  /*var [posts, setPosts] = useState([]);
  var [recentPosts, setRecentPosts] = useState([]);
  useEffect(() => {

    fetch('/api/grabPosts')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data)
        setRecentPosts(data.slice(0, 2))
      })

  }, [])

  var [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch('/api/grabCategories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data)
      })
  }, [])
*/
  return (
    <div className="container mx-auto px-10 mb-8">
      <Head>
        <title>Data Trends</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 col-span-1">
          {posts.map((post) => (
            <PostCard post={post} key={post.title} />
          ))}
        </div>
        <div className="lg:col-span-4 col-span-1">
          <div className="lg:sticky relative top-8">
            <PostWidget relatedPosts={{ recentPosts }} />
            <Categories categories={categories} />
          </div>
        </div>
      </div>
    </div>
  );
}
