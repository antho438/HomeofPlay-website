import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { BookOpen, ArrowLeft, GraduationCap, Lightbulb, Brain } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  published_at: string;
  author_id: string;
  category?: string;
}

export default function EducationalBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .eq('is_educational', true)
          .order('published_at', { ascending: false });

        if (error) {
          console.error('Error fetching posts:', error);
        } else {
          setPosts(data || []);
          
          // Extract unique categories
          const uniqueCategories = Array.from(
            new Set(data?.map(post => post.category).filter(Boolean) as string[])
          );
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const filteredPosts = selectedCategory 
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
          <BookOpen className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Educational Blog
        </h1>
        <p className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
          Expert insights on child development, play-based learning, and parenting
        </p>
      </div>

      {/* Educational Resources Banner */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 mb-10 shadow-md">
        <h2 className="text-xl font-bold text-primary-700 mb-2">Educational Resources</h2>
        <p className="text-gray-700 mb-4">
          Discover how play contributes to your child's development. Our educational resources 
          provide insights into age-appropriate toys and activities.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Link to="/learning-guides" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2">
              <GraduationCap className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="font-medium text-gray-900">Learning Guides</h3>
            </div>
            <p className="text-sm text-gray-600">
              Age-appropriate toy guides for each developmental stage.
            </p>
          </Link>
          <Link to="/play-ideas" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2">
              <Lightbulb className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="font-medium text-gray-900">Play Ideas</h3>
            </div>
            <p className="text-sm text-gray-600">
              Creative activities to maximize the educational value of toys.
            </p>
          </Link>
          <Link to="/skill-development" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2">
              <Brain className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="font-medium text-gray-900">Skill Development</h3>
            </div>
            <p className="text-sm text-gray-600">
              How different toys help develop specific skills in children.
            </p>
          </Link>
        </div>
      </div>

      {/* Educational Categories */}
      {categories.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === null
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              All Posts
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No educational posts yet</h3>
          <p className="mt-1 text-sm text-gray-500">Check back soon for new content!</p>
        </div>
      ) : (
        <div className="space-y-10">
          {filteredPosts.map((post) => (
            <article key={post.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {post.title}
                </h2>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <time dateTime={post.published_at}>
                    {format(new Date(post.published_at), 'MMMM d, yyyy')}
                  </time>
                  {post.category && (
                    <span className="ml-4 bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  )}
                </div>
                <div className="prose max-w-none">
                  {post.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Featured Educational Content */}
      <div className="mt-16 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1566140967404-b8b3932483f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Children playing with wooden toys" 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-8 md:w-1/2">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              The Importance of Play in Early Childhood Development
            </h3>
            <p className="text-gray-600 mb-4">
              Play is not just fun—it's how children learn about the world around them. Through play, children develop crucial cognitive, physical, social, and emotional skills that form the foundation for future learning.
            </p>
            <p className="text-gray-600 mb-6">
              Our carefully curated wooden toy collection is designed to support various aspects of development while keeping playtime engaging and enjoyable.
            </p>
            <div className="flex space-x-4">
              <Link 
                to="/learning-guides" 
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Learning Guides
              </Link>
              <Link 
                to="/play-ideas" 
                className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Play Ideas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
