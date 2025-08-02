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
    <Card className="hover:shadow-md transition-all duration-200 bg-white border border-gray-200 hover:border-blue-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0 pr-4">
            {/* Job Title */}
            <Link to={`/job/${id}`} className="block group">
              <h3 className="text-lg font-semibold text-blue-700 group-hover:text-blue-800 transition-colors mb-1 leading-tight">
                {title}
              </h3>
            </Link>
            
            {/* Company */}
            <p className="text-gray-900 font-medium mb-2 truncate">
              {company}
            </p>
            
            {/* Location & Type */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                <span className="truncate">{location}</span>
              </div>
              <Badge variant="outline" className="text-xs font-normal">
                {type}
              </Badge>
            </div>
            
            {/* Description */}
            <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2">
              {truncatedDescription}
            </p>
            
            {/* Bottom Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                  {category}
                </Badge>
                {salary && (
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="font-medium">{salary}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{postedDate}</span>
              </div>
            </div>
          </div>
          
          {/* Save Button (Indeed-style) */}
          <div className="flex flex-col items-end gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-blue-600 h-8 w-8 p-0"
              aria-label="Save job"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </Button>
            
            <Link to={`/job/${id}`}>
              <Button 
                size="sm" 
                className="h-8 px-4 text-sm bg-blue-600 hover:bg-blue-700 text-white"
              >
                View job
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

OptimizedJobCard.displayName = 'OptimizedJobCard';

export default OptimizedJobCard;