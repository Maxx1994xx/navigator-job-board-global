
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <Link to={`/job/${id}`}>
              <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                {title}
              </h3>
            </Link>
            <p className="text-lg text-gray-700 mt-1">{company}</p>
            <p className="text-gray-600 mt-1">{location}</p>
          </div>
          <Badge variant="secondary" className="ml-4">
            {category}
          </Badge>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline">{type}</Badge>
          {salary && <Badge variant="outline">{salary}</Badge>}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Posted {postedDate}</span>
          <Link to={`/job/${id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
