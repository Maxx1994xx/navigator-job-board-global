import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import AdBanner from '@/components/AdBanner';
import InContentAd from '@/components/InContentAd';
import ScrollTriggeredAd from '@/components/ScrollTriggeredAd';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  image_url?: string;
  tags: string[];
  reading_time: number;
  created_at: string;
  is_published: boolean;
}

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <SEO 
          title="Career Blog - Expert Job Search Tips & Career Advice | Online Career Navigator"
          description="Get expert career advice, job search tips, salary negotiation strategies, and remote work guidance. Stay updated with the latest career trends and opportunities."
        />
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-lg">Loading blog posts...</div>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }
  return (
    <>
      <SEO 
        title="Career Blog - Expert Job Search Tips & Career Advice | Online Career Navigator"
        description="Get expert career advice, job search tips, salary negotiation strategies, and remote work guidance. Stay updated with the latest career trends and opportunities."
      />
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Career Insights & Expert Advice
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay ahead in your career with our comprehensive guides, industry insights, 
              and proven strategies for job search success. Browse our <Link to="/jobs" className="text-blue-600 hover:text-blue-800 underline transition-colors">latest job opportunities</Link>, learn <Link to="/about" className="text-blue-600 hover:text-blue-800 underline transition-colors">about our platform</Link>, or <Link to="/contact" className="text-blue-600 hover:text-blue-800 underline transition-colors">connect with career experts</Link>.
            </p>
          </div>

          {/* AdBanner - After Hero */}
          <InContentAd className="mb-12" />

          {/* Featured Post */}
          {blogPosts.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Article</h2>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="md:flex">
                  <div className="md:w-1/3 relative overflow-hidden">
                     <img 
                       src={blogPosts[0].image_url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop'} 
                       alt={blogPosts[0].title}
                       className="w-full h-full object-cover"
                       loading="lazy"
                     />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/80 to-purple-600/80 p-8 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl font-bold">📚</span>
                        </div>
                        <p className="text-white/90 font-medium">Featured Guide</p>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/3 p-8">
                    <CardHeader className="p-0 mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                         <div className="flex items-center space-x-1">
                           <Calendar className="w-4 h-4" />
                           <span>{formatDate(blogPosts[0].created_at)}</span>
                         </div>
                         <div className="flex items-center space-x-1">
                           <Clock className="w-4 h-4" />
                           <span>{blogPosts[0].reading_time} min read</span>
                         </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                        <Link to={`/blog/${blogPosts[0].slug}`}>
                          {blogPosts[0].title}
                        </Link>
                      </h3>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {blogPosts[0].excerpt}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blogPosts[0].tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Link 
                        to={`/blog/${blogPosts[0].slug}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        Read Full Article
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* AdBanner - After Featured */}
          <InContentAd format="square" className="mb-12" />

          {/* All Posts Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                   <div className="h-48 relative overflow-hidden">
                     <img 
                       src={post.image_url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop'} 
                       alt={post.title}
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                       loading="lazy"
                     />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-white/90 text-gray-800 border-white/30">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                       <div className="flex items-center space-x-1">
                         <Calendar className="w-4 h-4" />
                         <span>{formatDate(post.created_at)}</span>
                       </div>
                       <div className="flex items-center space-x-1">
                         <Clock className="w-4 h-4" />
                         <span>{post.reading_time} min read</span>
                       </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">By {post.author}</span>
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                      >
                        Read More
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* AdBanner - Before Categories */}
          <InContentAd format="horizontal" className="mb-8" />

          {/* Categories Section */}
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore by Category</h2>
            <p className="text-gray-600 mb-6">Browse our career resources by topic, or visit external career resources like <a href="https://www.harvard.edu/career-guide/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline transition-colors">Harvard Career Guide</a>, <a href="https://www.themuse.com/advice" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline transition-colors">The Muse Career Advice</a>, and <a href="https://www.careerbuilder.com/advice" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline transition-colors">CareerBuilder Advice</a>.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Job Search', count: 5, icon: '🔍' },
                { name: 'Career Tips', count: 8, icon: '💼' },
                { name: 'Remote Work', count: 3, icon: '🏠' },
                { name: 'Salary Negotiation', count: 2, icon: '💰' }
              ].map((category) => (
                <Link 
                  key={category.name}
                  to={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} articles</p>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600">Looking for opportunities? <Link to="/jobs" className="text-blue-600 hover:text-blue-800 underline transition-colors">Browse our job listings</Link> or <Link to="/contact" className="text-blue-600 hover:text-blue-800 underline transition-colors">get career consultation</Link>.</p>
            </div>
          </div>
        </main>
        
        {/* Scroll Triggered Ad */}
        <ScrollTriggeredAd triggerPercentage={50} format="vertical" />
        
        <Footer />
      </div>
    </>
  );
};

export default Blog;