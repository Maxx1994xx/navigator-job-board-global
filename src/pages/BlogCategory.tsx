import { useParams, Link, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { getBlogPostsByCategory, getAllCategories } from '@/data/blogData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const BlogCategory = () => {
  const { category } = useParams<{ category: string }>();
  
  if (!category) {
    return <Navigate to="/blog" replace />;
  }

  const posts = getBlogPostsByCategory(category);
  const categories = getAllCategories();
  const currentCategory = categories.find(cat => 
    cat.name.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase()
  );

  if (!currentCategory) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <>
      <SEO 
        title={`${currentCategory.name} Articles | Online Career Navigator Blog`}
        description={`Expert ${currentCategory.name.toLowerCase()} advice and tips. Browse our comprehensive collection of career guidance articles.`}
      />
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back to Blog */}
          <div className="mb-8">
            <Link 
              to="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Articles
            </Link>
          </div>

          {/* Category Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">{currentCategory.icon}</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {currentCategory.name} Articles
            </h1>
            <p className="text-xl text-gray-600">
              {currentCategory.count} expert articles on {currentCategory.name.toLowerCase()}
            </p>
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={post.featuredImage} 
                    alt={post.imageAlt}
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
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
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
            ))
            }
          </div>

          {/* Other Categories */}
          <div className="mt-16 bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Other Categories</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.filter(cat => cat.name !== currentCategory.name).map((cat) => (
                <Link 
                  key={cat.name}
                  to={`/blog/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="text-2xl mb-2">{cat.icon}</div>
                  <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                  <p className="text-sm text-gray-500">{cat.count} articles</p>
                </Link>
              ))}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default BlogCategory;
