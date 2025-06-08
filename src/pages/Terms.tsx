
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: June 8, 2024</p>
        </div>

        <Card>
          <CardContent className="p-8 prose prose-gray max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              Welcome to Online Career Navigator. These Terms of Service govern your use of our website 
              and services. By accessing or using our platform, you agree to be bound by these terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-700">
              By accessing and using Online Career Navigator (onlinecareernavigator.com), you accept and 
              agree to be bound by the terms and provision of this agreement. If you do not agree to 
              abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Use License</h2>
            <p className="text-gray-700 mb-4">
              Permission is granted to temporarily download one copy of the materials on Online Career 
              Navigator's website for personal, non-commercial transitory viewing only. This is the 
              grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">User Conduct</h2>
            <p className="text-gray-700 mb-4">You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Submit false, misleading, or fraudulent information</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated systems to access the service</li>
              <li>Post or transmit any harmful, threatening, or offensive content</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Job Listings and Applications</h2>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Job Listings</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>We strive to ensure all job listings are accurate and legitimate</li>
              <li>We reserve the right to remove any job listing at our discretion</li>
              <li>We are not responsible for the content or accuracy of individual job listings</li>
              <li>Employment decisions are made solely by the hiring companies</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Job Applications</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>You are responsible for the accuracy of your application information</li>
              <li>We may share your application information with potential employers</li>
              <li>We do not guarantee job placement or interview opportunities</li>
              <li>All employment negotiations are between you and the employer</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Disclaimer</h2>
            <p className="text-gray-700">
              The materials on Online Career Navigator's website are provided on an 'as is' basis. 
              Online Career Navigator makes no warranties, expressed or implied, and hereby disclaims 
              and negates all other warranties including without limitation, implied warranties or 
              conditions of merchantability, fitness for a particular purpose, or non-infringement 
              of intellectual property or other violation of rights.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Limitations</h2>
            <p className="text-gray-700">
              In no event shall Online Career Navigator or its suppliers be liable for any damages 
              (including, without limitation, damages for loss of data or profit, or due to business 
              interruption) arising out of the use or inability to use the materials on Online Career 
              Navigator's website, even if Online Career Navigator or an authorized representative has 
              been notified orally or in writing of the possibility of such damage.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Accuracy of Materials</h2>
            <p className="text-gray-700">
              The materials appearing on Online Career Navigator's website could include technical, 
              typographical, or photographic errors. Online Career Navigator does not warrant that 
              any of the materials on its website are accurate, complete, or current. We may make 
              changes to the materials contained on its website at any time without notice.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Links</h2>
            <p className="text-gray-700">
              Online Career Navigator has not reviewed all of the sites linked to our website and is 
              not responsible for the contents of any such linked site. The inclusion of any link does 
              not imply endorsement by Online Career Navigator of the site. Use of any such linked 
              website is at the user's own risk.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Modifications</h2>
            <p className="text-gray-700">
              Online Career Navigator may revise these terms of service at any time without notice. 
              By using this website, you are agreeing to be bound by the then current version of 
              these terms of service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Governing Law</h2>
            <p className="text-gray-700">
              These terms and conditions are governed by and construed in accordance with the laws 
              of the jurisdiction in which Online Career Navigator operates, and you irrevocably 
              submit to the exclusive jurisdiction of the courts in that state or location.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Information</h2>
            <p className="text-gray-700">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="font-semibold">Online Career Navigator</p>
              <p>Email: legal@onlinecareernavigator.com</p>
              <p>Website: onlinecareernavigator.com</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;
