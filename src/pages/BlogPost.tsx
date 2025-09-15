import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2, BookmarkPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import AdSenseAd from '@/components/AdSenseAd';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  html_content?: string;
  category: string;
  author: string;
  image_url?: string;
  seo_title?: string;
  seo_description?: string;
  tags: string[];
  reading_time: number;
  created_at: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      
      setPost(data);
      
      // Fetch related posts
      const { data: related } = await supabase
        .from('blogs')
        .select('*')
        .eq('category', data.category)
        .neq('id', data.id)
        .eq('is_published', true)
        .limit(3);
      
      setRelatedPosts(related || []);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-lg">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <SEO 
        title={post.seo_title || `${post.title} | Online Career Navigator Blog`}
        description={post.seo_description || post.excerpt}
        type="article"
        image={post.image_url}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "description": post.excerpt,
          "author": {
            "@type": "Person",
            "name": post.author
          },
          "publisher": {
            "@type": "Organization",
            "name": "Online Career Navigator",
            "logo": {
              "@type": "ImageObject",
              "url": "https://onlinecareernavigator.com/placeholder.svg"
            }
          },
          "datePublished": post.created_at,
          "dateModified": post.created_at,
          "articleSection": post.category,
          "wordCount": Math.ceil(post.content.length / 5),
          "timeRequired": `PT${post.reading_time}M`,
          "image": post.image_url,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://onlinecareernavigator.com/blog/${post.slug}`
          }
        }}
      />
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Link 
              to="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </div>

          <article className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="h-64 md:h-80 overflow-hidden">
              <img 
                src={post.image_url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop'} 
                alt={post.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            <div className="p-8 lg:p-12">
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary">{post.category}</Badge>
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.reading_time} min read</span>
                  </div>
                  <span>By {post.author}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleShare}
                    className="flex items-center space-x-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </Button>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="text-xl text-gray-600 mb-8 leading-relaxed font-medium">
                  {post.excerpt}
                </div>
                
                <div 
                  className="blog-content text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: post.html_content || post.content
                  }}
                />
              </div>
            </div>
          </article>

          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow group overflow-hidden">
                    <div className="h-32 relative overflow-hidden">
                      <img 
                        src={relatedPost.image_url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop'} 
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        <Link to={`/blog/${relatedPost.slug}`}>
                          {relatedPost.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{relatedPost.reading_time} min read</span>
                        <Link 
                          to={`/blog/${relatedPost.slug}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
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
          )}
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default BlogPost;