import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PostCard, Categories } from '../../components';

export default function CategoryPost() {

  const { query, isReady } = useRouter();

  var [posts, setPosts] = useState([]);
  useEffect(() => {
    if (isReady) {
      const slug = query.slug;
      fetch('/api/grabCategoryPosts?slug=' + slug)
        .then((res) => res.json())
        .then((data) => {
          setPosts(data)
        })
    }

  }, [query])

  var [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch('/api/grabCategories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data)
      })
  }, [])

  return (
    <div className="container mx-auto px-10 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="col-span-1 lg:col-span-8">
          {posts.map((post, index) => (
            <PostCard key={index} post={post} />
          ))}
        </div>
        <div className="col-span-1 lg:col-span-4">
          <div className="relative lg:sticky top-8">
            <Categories categories={categories} />
          </div>
        </div>
      </div>
    </div>
  );
};
