import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Users, Briefcase, TrendingUp, Globe, Award, Clock, Star, CheckCircle, ArrowRight, Target, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import SEO from '@/components/SEO';
import { useJobs, useFeaturedJobs } from '@/hooks/useJobs';

interface CategoryCount {
  category: string;
  count: number;
  icon: string;
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();
  
  const { data: allJobs = [], isLoading: jobsLoading } = useJobs();
  const { data: featuredJobs = [] } = useFeaturedJobs();

  const countries = ['UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'USA', 'UK', 'Bahrain', 'Oman'];
  const categories = ['Technology', 'Sales', 'Healthcare', 'Finance', 'Marketing', 'Design'];

  const categoryIcons: { [key: string]: string } = {
    'Technology': '💻',
    'Sales': '💼',
    'Healthcare': '🏥',
    'Finance': '💰',
    'Marketing': '📈',
    'Design': '🎨'
  };

  const categoryStats = useMemo(() => {
    const categoryCounts: { [key: string]: number } = {};
    allJobs.forEach(job => {
      categoryCounts[job.category] = (categoryCounts[job.category] || 0) + 1;
    });

    return categories.map(category => ({
      category,
      count: categoryCounts[category] || 0,
      icon: categoryIcons[category] || '📋'
    }));
  }, [allJobs]);

  const countryStats = useMemo(() => {
    const countryCounts: { [key: string]: number } = {};
    allJobs.forEach(job => {
      const country = job.location.split(',').pop()?.trim() || job.location;
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });
    return countryCounts;
  }, [allJobs]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCountry) params.set('country', selectedCountry);
    if (selectedCategory) params.set('category', selectedCategory);
    
    navigate(`/jobs?${params.toString()}`);
  };

  const testimonials = [
    {
      name: "Sarah Ahmed",
      role: "Software Engineer",
      company: "Tech Corp Dubai",
      content: "Found my dream job in just 2 weeks! The platform made it so easy to connect with top employers in the UAE.",
      rating: 5
    },
    {
      name: "Michael Johnson",
      role: "Marketing Manager",
      company: "Global Marketing UK",
      content: "Excellent service and genuine opportunities. The job matching was spot-on for my skills and experience.",
      rating: 5
    },
    {
      name: "Priya Sharma",
      role: "Healthcare Specialist",
      company: "Medical Center Qatar",
      content: "Professional platform with verified employers. Landed a great position in Qatar's healthcare sector.",
      rating: 5
    }
  ];

  const benefits = [
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Targeted Job Matching",
      description: "Our advanced algorithm matches your skills with the perfect job opportunities across Gulf, USA, and UK markets."
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      title: "Quick Applications",
      description: "Apply to multiple jobs with just one click. No lengthy registration process or complicated forms to fill out."
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Verified Employers",
      description: "All our partner companies are thoroughly vetted to ensure legitimate opportunities and fair employment practices."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Online Career Navigator - Find Jobs in Gulf, USA & UK | Premier Job Search Platform"
        description="Discover thousands of verified job opportunities across Gulf countries (UAE, Saudi Arabia, Qatar, Kuwait), USA, and UK. Connect with top employers and advance your career with our premium job search platform."
        keywords="jobs in gulf, jobs in UAE, jobs in Saudi Arabia, jobs in USA, jobs in UK, career opportunities, job search, employment, recruitment, premium jobs"
        image="https://onlinecareernavigator.com/placeholder.svg"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Navigate Your <span className="text-blue-200">Career Journey</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Discover thousands of premium career opportunities across Gulf countries, USA, and UK. 
              Connect with top employers and take your career to new heights. <Link to="/about" className="text-blue-200 hover:text-white underline transition-colors">Learn more about our mission</Link> or explore our <Link to="/blog" className="text-blue-200 hover:text-white underline transition-colors">career guidance blog</Link>.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <Globe className="w-5 h-5 mr-2" />
                Global Opportunities
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <Users className="w-5 h-5 mr-2" />
                Trusted by 50,000+
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <Award className="w-5 h-5 mr-2" />
                Premium Employers
              </Badge>
            </div>
          </div>

          {/* Enhanced Search Form */}
          <div className="max-w-5xl mx-auto">
            <Card className="p-8 shadow-2xl">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title or Keywords
                    </label>
                    <Input
                      placeholder="e.g. Software Engineer, Marketing Manager"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-14 text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country/Region
                    </label>
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger className="h-14 text-lg">
                        <SelectValue placeholder="Select Location" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      &nbsp;
                    </label>
                    <Button onClick={handleSearch} className="h-14 w-full text-lg bg-blue-600 hover:bg-blue-700">
                      <Search className="w-6 h-6 mr-3" />
                      Find Jobs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Professionals Worldwide</h2>
            <p className="text-xl text-gray-600">Join thousands of successful career transitions</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-5xl font-bold text-blue-600 mb-3">{allJobs.length.toLocaleString()}+</div>
              <div className="text-gray-600 text-lg">Active Job Listings</div>
              <Briefcase className="w-8 h-8 text-blue-500 mx-auto mt-4" />
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-blue-600 mb-3">500+</div>
              <div className="text-gray-600 text-lg">Trusted Companies</div>
              <Users className="w-8 h-8 text-blue-500 mx-auto mt-4" />
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-blue-600 mb-3">50,000+</div>
              <div className="text-gray-600 text-lg">Success Stories</div>
              <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mt-4" />
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-blue-600 mb-3">15+</div>
              <div className="text-gray-600 text-lg">Countries Covered</div>
              <Globe className="w-8 h-8 text-blue-500 mx-auto mt-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Professionals Choose Us</h2>
            <p className="text-xl text-gray-600">Experience the difference with our premium job search platform. <Link to="/about" className="text-blue-600 hover:text-blue-800 underline transition-colors">Read our full story</Link> and discover what makes us different.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Categories Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Top Categories</h2>
            <p className="text-xl text-gray-600">Find opportunities in your field of expertise</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {categoryStats.map((category, index) => (
              <Link key={index} to={`/jobs?category=${category.category}`}>
                <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                  <CardContent className="p-8 text-center">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.category}</h3>
                    <p className="text-blue-600 font-medium text-lg">{category.count} jobs</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Opportunities</h2>
            <p className="text-xl text-gray-600">Hand-picked premium positions from top employers</p>
          </div>
          
          {featuredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredJobs.map(job => (
                <JobCard 
                  key={job.id} 
                  {...job} 
                  postedDate={new Date(job.created_at).toLocaleDateString()}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">No featured jobs available at the moment.</p>
              <Link to="/jobs">
                <Button variant="outline">Browse All Jobs</Button>
              </Link>
            </div>
          )}

          <div className="text-center">
            <Link to="/jobs">
              <Button size="lg" className="px-8 py-4 text-lg">
                <Search className="w-5 h-5 mr-2" />
                View All Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Success Stories / Testimonials */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Hear from professionals who found their dream careers. Need career tips? Check out our <Link to="/blog" className="text-blue-600 hover:text-blue-800 underline transition-colors">expert blog articles</Link> or <Link to="/contact" className="text-blue-600 hover:text-blue-800 underline transition-colors">get personalized guidance</Link>.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-blue-600 font-medium">{testimonial.role}</p>
                    <p className="text-gray-500 text-sm">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Explore Global Opportunities</h2>
            <p className="text-xl text-gray-300">Find your next career move in these dynamic markets</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {countries.map(country => (
              <Link key={country} to={`/jobs?country=${country}`}>
                <Card className="bg-gray-800 border-gray-700 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:bg-gray-700">
                  <CardContent className="p-8 text-center">
                    <MapPin className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-white text-lg mb-2">{country}</h3>
                    <p className="text-blue-300 font-medium">
                      {countryStats[country] || 0} jobs
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Your journey to a new career in just 3 simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center relative">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Search & Discover</h3>
              <p className="text-gray-600 leading-relaxed">
                Browse thousands of verified job opportunities across Gulf countries, USA, and UK using our advanced search filters.
              </p>
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute top-8 left-full w-12">
                <ArrowRight className="w-8 h-8 text-blue-300 mx-auto" />
              </div>
            </div>
            
            <div className="text-center relative">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Apply Instantly</h3>
              <p className="text-gray-600 leading-relaxed">
                Submit your application with just one click. No registration required - simply apply to jobs that match your profile.
              </p>
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute top-8 left-full w-12">
                <ArrowRight className="w-8 h-8 text-blue-300 mx-auto" />
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Get Hired</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect directly with hiring managers and HR teams. Start your new career journey with confidence and support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your Dream Job?</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of professionals who have successfully launched their careers with Online Career Navigator. 
            Explore our <Link to="/blog" className="text-blue-200 hover:text-white underline transition-colors">career resources</Link>, learn <Link to="/about" className="text-blue-200 hover:text-white underline transition-colors">about our services</Link>, or <Link to="/contact" className="text-blue-200 hover:text-white underline transition-colors">contact our career experts</Link>. For additional guidance, visit <a href="https://www.linkedin.com/advice/career-advice" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white underline transition-colors">LinkedIn Career Advice</a> and <a href="https://www.glassdoor.com/blog/guide/" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white underline transition-colors">Glassdoor Career Guide</a>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/jobs">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg font-semibold">
                <Search className="w-5 h-5 mr-2" />
                Browse All Jobs
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Online Career Navigator?</h2>
            <p className="text-xl text-gray-600">Your success is our mission</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Real-Time Updates</h3>
              <p className="text-gray-600 leading-relaxed">
                Get instant notifications about new job openings that match your profile and preferences.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Premium Employers</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with top-tier companies and multinational corporations across multiple regions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Global Reach</h3>
              <p className="text-gray-600 leading-relaxed">
                Access opportunities across Gulf countries, USA, UK, and other major job markets worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
