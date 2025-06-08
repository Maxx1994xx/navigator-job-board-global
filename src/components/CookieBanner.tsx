
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('cookiesAccepted');
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookiesAccepted', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-6 md:right-6 lg:left-auto lg:right-6 lg:max-w-md">
      <Card className="shadow-2xl border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Cookie className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">We use cookies</h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                We use cookies to enhance your browsing experience, serve personalized ads, 
                and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <Button onClick={acceptCookies} size="sm" className="flex-1">
                  Accept All
                </Button>
                <Button onClick={declineCookies} variant="outline" size="sm" className="flex-1">
                  Decline
                </Button>
              </div>
              <Link 
                to="/cookie-policy" 
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
              >
                Learn more about our cookie policy
              </Link>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={declineCookies}
              className="p-1 h-auto flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieBanner;
