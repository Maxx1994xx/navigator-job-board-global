import { useParams, Link, Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2, BookmarkPlus } from 'lucide-react';
import { getBlogPostBySlug, getRelatedPosts } from '@/data/blogData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  
  if (!slug) {
    return <Navigate to="/blog" replace />;
  }

  const post = getBlogPostBySlug(slug);
  
  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const relatedPosts = getRelatedPosts(post.id);

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
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      <SEO 
        title={`${post.title} | Online Career Navigator Blog`}
        description={post.metaDescription}
      />
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back to Blog */}
          <div className="mb-8">
            <Link 
              to="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </div>

          {/* Article Header */}
          <article className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-8 lg:p-12">
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
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
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <BookmarkPlus className="w-4 h-4" />
                    <span>Save</span>
                  </Button>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <div className="text-xl text-gray-600 mb-8 leading-relaxed font-medium">
                  {post.excerpt}
                </div>
                
                <div 
                  className="blog-content text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: post.content
                      .replace(/\n/g, '<br />')
                      .replace(/# (.*?)(<br \/>|$)/g, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h2>')
                      .replace(/## (.*?)(<br \/>|$)/g, '<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">$1</h3>')
                      .replace(/### (.*?)(<br \/>|$)/g, '<h4 class="text-lg font-semibold text-gray-900 mt-4 mb-2">$1</h4>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
                      .replace(/- \*\*(.*?)\*\*/g, '<li class="mb-2"><strong class="font-semibold text-gray-900">$1</strong>')
                      .replace(/- (.*?)(<br \/>|$)/g, '<li class="mb-1">$1</li>')
                      .replace(/(<li.*?>.*?<\/li>)/g, '<ul class="list-disc list-inside mb-4 space-y-1">$1</ul>')
                      .replace(/<\/ul><br \/><ul[^>]*>/g, '')
                  }}
                />
              </div>

              {/* Keywords */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {post.keywords.map((keyword) => (
                    <Badge key={keyword} variant="outline" className="text-sm">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow group">
                    <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600"></div>
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
                        <span>{relatedPost.readTime}</span>
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

          {/* Call to Action */}
          <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Take the Next Step in Your Career?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Explore thousands of job opportunities and find the perfect position that matches your skills and aspirations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/jobs">
                  Browse Jobs
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/blog">
                  More Career Tips
                </Link>
              </Button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default BlogPost;