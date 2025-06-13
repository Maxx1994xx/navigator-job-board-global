
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TARGETED_LOCATIONS = [
  'Dubai, UAE',
  'Abu Dhabi, UAE',
  'Sharjah, UAE',
  'Riyadh, Saudi Arabia',
  'Jeddah, Saudi Arabia',
  'Dammam, Saudi Arabia',
  'Doha, Qatar',
  'Kuwait City, Kuwait',
  'Manama, Bahrain',
  'Muscat, Oman',
  'London, UK',
  'Manchester, UK',
  'Birmingham, UK',
  'New York, USA',
  'Los Angeles, USA',
  'Chicago, USA',
  'San Francisco, USA',
  'Toronto, Canada',
  'Vancouver, Canada',
  'Sydney, Australia',
  'Melbourne, Australia',
  'Singapore',
  'Hong Kong',
  'Remote',
  'Hybrid'
];

interface LocationSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const LocationSelect = ({ value, onChange, placeholder = "Select location" }: LocationSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-60 overflow-y-auto">
        {TARGETED_LOCATIONS.map((location) => (
          <SelectItem key={location} value={location}>
            {location}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LocationSelect;
export { TARGETED_LOCATIONS };
