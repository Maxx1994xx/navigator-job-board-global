
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import AdSenseAd from '@/components/AdSenseAd';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, MapPin, Clock, Youtube, Instagram, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Contact Us - Online Career Navigator | Get in Touch"
        description="Contact Online Career Navigator for job search assistance, career guidance, or business inquiries. Serving Gulf countries, USA, and UK. 24-48 hour response time."
        keywords="contact, job search help, career assistance, support, Gulf jobs, USA jobs, UK jobs, career guidance"
      />
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about our services or need assistance with your job search? 
            We're here to help you navigate your career journey. Explore our <Link to="/jobs" className="text-blue-600 hover:text-blue-800 underline transition-colors">job listings</Link>, read our <Link to="/blog" className="text-blue-600 hover:text-blue-800 underline transition-colors">career advice</Link>, or learn <Link to="/about" className="text-blue-600 hover:text-blue-800 underline transition-colors">about our mission</Link>.
          </p>
        </div>

        {/* AdSense Ad - After Header */}
        <div className="mb-8">
          <AdSenseAd className="text-center" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Mail className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Email Us</h3>
                </div>
                <p className="text-gray-700 mb-2">General Inquiries:</p>
                <p className="text-blue-600 font-medium">info@onlinecareernavigator.com</p>
                <p className="text-gray-700 mb-2 mt-4">Job Postings:</p>
                <p className="text-blue-600 font-medium">jobs@onlinecareernavigator.com</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Our Presence</h3>
                </div>
                <div className="space-y-2 text-gray-700">
                  <p>🇦🇪 Dubai, United Arab Emirates</p>
                  <p>🇸🇦 Riyadh, Saudi Arabia</p>
                  <p>🇺🇸 New York, United States</p>
                  <p>🇬🇧 London, United Kingdom</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Response Time</h3>
                </div>
                <p className="text-gray-700">
                  We typically respond to all inquiries within 24-48 hours during business days.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect With Us</h3>
                <p className="text-gray-700 mb-4">Follow us on social media for job updates and career tips. Also check our <Link to="/privacy" className="text-blue-600 hover:text-blue-800 underline transition-colors">privacy policy</Link> and <Link to="/terms" className="text-blue-600 hover:text-blue-800 underline transition-colors">terms of service</Link>:</p>
                <div className="flex space-x-4">
                  <a 
                    href="https://www.youtube.com/@OnlineCareerNavigator" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    aria-label="Follow us on YouTube"
                  >
                    <Youtube className="w-6 h-6" />
                  </a>
                  <a 
                    href="https://x.com/OnlineCareerNav" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    aria-label="Follow us on X"
                  >
                    <X className="w-6 h-6" />
                  </a>
                  <a 
                    href="https://www.instagram.com/onlinecareernavigator/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    aria-label="Follow us on Instagram"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="mt-1"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="mt-1 min-h-[120px]"
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>

                  <Button type="submit" className="w-full md:w-auto">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="mt-8">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      How do I apply for a job listed on your website?
                    </h3>
                    <p className="text-gray-700">
                      Simply click on any job listing to view the full details and application instructions. 
                      You can apply directly through the contact email provided for each position. <Link to="/jobs" className="text-blue-600 hover:text-blue-800 underline transition-colors">Browse all available positions</Link> or read our <Link to="/blog" className="text-blue-600 hover:text-blue-800 underline transition-colors">application tips</Link>.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Are the job listings on your website legitimate?
                    </h3>
                    <p className="text-gray-700">
                      Yes, we carefully verify all job postings before they appear on our platform. 
                      We work only with reputable companies and organizations.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      How often are new jobs posted?
                    </h3>
                    <p className="text-gray-700">
                      We update our job listings daily with new opportunities. We recommend checking 
                      back regularly or setting up search alerts for your preferred positions.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Do you charge job seekers for using your services?
                    </h3>
                    <p className="text-gray-700">
                      No, our platform is completely free for job seekers. We never charge individuals 
                      for accessing job listings or applying for positions. Learn more <Link to="/about" className="text-blue-600 hover:text-blue-800 underline transition-colors">about our services</Link> and review our <Link to="/terms" className="text-blue-600 hover:text-blue-800 underline transition-colors">terms of service</Link> for complete details.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
