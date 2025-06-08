
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-gray-600">Last updated: June 8, 2024</p>
        </div>

        <Card>
          <CardContent className="p-8 prose prose-gray max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              This Cookie Policy explains how Online Career Navigator ("we", "us", or "our") uses cookies 
              and similar technologies to recognize you when you visit our website at onlinecareernavigator.com.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What are cookies?</h2>
            <p className="text-gray-700 mb-4">
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
              Cookies are widely used by website owners to make their websites work, or to work more efficiently, 
              as well as to provide reporting information.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Why do we use cookies?</h2>
            <p className="text-gray-700 mb-4">We use cookies for several reasons:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>To provide essential website functionality</li>
              <li>To remember your preferences and settings</li>
              <li>To analyze website traffic and user behavior</li>
              <li>To improve our services and user experience</li>
              <li>To serve relevant advertisements (Google AdSense)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Types of cookies we use</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Essential Cookies</h3>
            <p className="text-gray-700 mb-4">
              These cookies are necessary for the website to function properly. They enable core functionality 
              such as security, network management, and accessibility.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Analytics Cookies</h3>
            <p className="text-gray-700 mb-4">
              We use Google Analytics to understand how visitors interact with our website. These cookies 
              collect information about how you use our site, which pages you visit, and any errors you encounter.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Advertising Cookies</h3>
            <p className="text-gray-700 mb-4">
              We use Google AdSense to display advertisements on our website. These cookies help us show 
              you relevant ads based on your interests and browsing behavior.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Third-party cookies</h2>
            <p className="text-gray-700 mb-4">
              Our website may contain content from third-party services such as:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>Google Analytics - for website analytics</li>
              <li>Google AdSense - for displaying advertisements</li>
              <li>Social media platforms - for sharing content</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How to control cookies</h2>
            <p className="text-gray-700 mb-4">
              You can control and/or delete cookies as you wish. You can delete all cookies that are 
              already on your computer and you can set most browsers to prevent them from being placed.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Browser Settings</h3>
            <p className="text-gray-700 mb-4">
              Most web browsers allow you to control cookies through their settings preferences. 
              However, if you limit the ability of websites to set cookies, you may worsen your overall user experience.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Opt-out Options</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>Google Analytics: Visit <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline">Google Analytics Opt-out</a></li>
              <li>Google Ads: Visit <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline">Google Ad Settings</a></li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Updates to this policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for 
              other operational, legal, or regulatory reasons.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact us</h2>
            <p className="text-gray-700">
              If you have any questions about our use of cookies, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="font-semibold">Online Career Navigator</p>
              <p>Email: cookies@onlinecareernavigator.com</p>
              <p>Website: onlinecareernavigator.com</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default CookiePolicy;
