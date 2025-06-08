
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Building, DollarSign } from 'lucide-react';

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  description: string;
  postedDate: string;
  category: string;
}

const JobCard = ({ 
  id, 
  title, 
  company, 
  location, 
  type, 
  salary, 
  description, 
  postedDate,
  category 
}: JobCardProps) => {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500 group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <Link to={`/job/${id}`}>
              <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors group-hover:text-blue-600 mb-2">
                {title}
              </h3>
            </Link>
            <div className="flex items-center text-gray-700 mb-2">
              <Building className="w-4 h-4 mr-2 text-gray-500" />
              <span className="font-medium">{company}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-gray-500" />
              <span>{location}</span>
            </div>
          </div>
          <Badge variant="secondary" className="ml-4 font-medium">
            {category}
          </Badge>
        </div>

        <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
          {description}
        </p>

        <div className="flex flex-wrap gap-3 mb-6">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {type}
          </Badge>
          {salary && (
            <Badge variant="outline" className="flex items-center gap-1 text-green-700 border-green-200">
              <DollarSign className="w-3 h-3" />
              {salary}
            </Badge>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            Posted {postedDate}
          </div>
          <Link to={`/job/${id}`}>
            <Button variant="outline" size="sm" className="group-hover:bg-blue-600 group-hover:text-white transition-colors">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
