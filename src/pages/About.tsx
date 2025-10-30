
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import EzoicAd from '@/components/EzoicAd';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Globe, Target, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="About Us - Online Career Navigator | Connecting Talent with Opportunities"
        description="Learn about Online Career Navigator's mission to connect professionals with exceptional career opportunities across Gulf countries, USA, and UK. Quality-first job search platform."
        keywords="about us, career platform, job search, Gulf jobs, USA jobs, UK jobs, career opportunities, professional recruitment"
      />
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Online Career Navigator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're dedicated to connecting talented professionals with exceptional career opportunities 
            across Gulf countries, USA, and UK. Your career journey is our priority. Explore our <Link to="/jobs" className="text-blue-600 hover:text-blue-800 underline transition-colors">job listings</Link>, read our <Link to="/blog" className="text-blue-600 hover:text-blue-800 underline transition-colors">career guidance blog</Link>, or <Link to="/contact" className="text-blue-600 hover:text-blue-800 underline transition-colors">get in touch</Link> with our team.
          </p>
        </div>

        {/* AdSense Ad - After Hero */}
        <div className="mb-8">
          <EzoicAd placementId={102} className="text-center" />
        </div>

        {/* Mission Section */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Online Career Navigator was founded with a simple yet powerful mission: to bridge the gap between 
              exceptional talent and outstanding career opportunities. We believe that everyone deserves to find 
              a job that not only matches their skills but also fulfills their career aspirations.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our platform serves as a comprehensive career hub, specializing in opportunities across some of 
              the world's most dynamic job markets including the Gulf Cooperation Council (GCC) countries, 
              United States, and United Kingdom. Browse <Link to="/jobs?category=Technology" className="text-blue-600 hover:text-blue-800 underline transition-colors">technology positions</Link>, <Link to="/jobs?category=Healthcare" className="text-blue-600 hover:text-blue-800 underline transition-colors">healthcare roles</Link>, or <Link to="/jobs?category=Finance" className="text-blue-600 hover:text-blue-800 underline transition-colors">finance opportunities</Link> across these regions.
            </p>
          </CardContent>
        </Card>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Quality First</h3>
              </div>
              <p className="text-gray-700">
                We carefully curate job listings to ensure they meet high standards of quality, 
                legitimacy, and career growth potential.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Globe className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Global Reach</h3>
              </div>
              <p className="text-gray-700">
                Our extensive network spans across multiple countries, giving you access to 
                diverse opportunities in various industries.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">User-Centric</h3>
              </div>
              <p className="text-gray-700">
                Every feature we develop is designed with job seekers in mind, ensuring a 
                seamless and efficient job search experience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Award className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Excellence</h3>
              </div>
              <p className="text-gray-700">
                We strive for excellence in everything we do, from our platform's functionality 
                to the quality of opportunities we present.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AdSense Ad - After Values */}
        <div className="mb-8">
          <EzoicAd placementId={103} className="text-center" />
        </div>

        {/* What We Offer */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">What We Offer</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Job Listings</h3>
                <p className="text-gray-700">
                  From entry-level positions to executive roles, we feature opportunities across all 
                  experience levels and industries.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Regional Expertise</h3>
                <p className="text-gray-700">
                  Our deep understanding of Gulf, American, and British job markets helps you navigate 
                  different employment landscapes effectively. Explore opportunities in <Link to="/jobs?country=UAE" className="text-blue-600 hover:text-blue-800 underline transition-colors">UAE</Link>, <Link to="/jobs?country=USA" className="text-blue-600 hover:text-blue-800 underline transition-colors">USA</Link>, or <Link to="/jobs?country=UK" className="text-blue-600 hover:text-blue-800 underline transition-colors">UK</Link>. For market insights, visit <a href="https://www.indeed.com/career-guide" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline transition-colors">Indeed Career Guide</a> and <a href="https://www.monster.com/career-advice" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline transition-colors">Monster Career Advice</a>.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">User-Friendly Experience</h3>
                <p className="text-gray-700">
                  Our intuitive platform makes job searching simple and efficient, with powerful 
                  filters and search capabilities.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Regular Updates</h3>
                <p className="text-gray-700">
                  We continuously update our job listings to ensure you have access to the most 
                  current opportunities available.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Start Your Journey?</h2>
            <p className="text-gray-700 mb-6">
              Join thousands of professionals who have found their dream jobs through Online Career Navigator. 
              Read our <Link to="/blog" className="text-blue-600 hover:text-blue-800 underline transition-colors">career success stories</Link> and get <Link to="/contact" className="text-blue-600 hover:text-blue-800 underline transition-colors">personalized support</Link> from our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/jobs"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Jobs
              </a>
              <a 
                href="/contact"
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default About;
