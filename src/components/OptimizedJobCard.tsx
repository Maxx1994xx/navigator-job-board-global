import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OptimizedJobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  description: string;
  salary?: string;
  postedDate: string;
}

const OptimizedJobCard = memo(({ 
  id, 
  title, 
  company, 
  location, 
  type, 
  category, 
  description, 
  salary, 
  postedDate 
}: OptimizedJobCardProps) => {
  // Truncate description for better performance
  const truncatedDescription = description.length > 150 
    ? description.substring(0, 150) + '...' 
    : description;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500 w-full max-w-full overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <Link to={`/job/${id}`} className="block">
              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 sm:truncate">
                {title}
              </h3>
            </Link>
            <p className="text-gray-600 font-medium truncate">{company}</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>
          <Badge variant="secondary" className="self-start flex-shrink-0">
            {type}
          </Badge>
        </div>
        
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {truncatedDescription}
        </p>
        
        <div className="space-y-3 sm:space-y-0 sm:flex sm:justify-between sm:items-center">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <Badge variant="outline" className="text-xs">
              {category}
            </Badge>
            {salary && (
              <div className="flex items-center">
                <DollarSign className="h-3 w-3 mr-1" />
                <span className="text-xs sm:text-sm">{salary}</span>
              </div>
            )}
            <div className="flex items-center text-xs text-gray-400">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{postedDate}</span>
            </div>
          </div>
          
          <Link to={`/job/${id}`} className="block sm:inline-block">
            <Button size="sm" className="w-full sm:w-auto text-xs">
              View Details
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
});

OptimizedJobCard.displayName = 'OptimizedJobCard';

export default OptimizedJobCard;