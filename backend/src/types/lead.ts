export interface Campaign {
  id: string;
  name: string;
  status: string; 
  objective: string; 
  account_id: string;
  platform: string;
  start_time: string;   
  stop_time?: string;  
  created_time: string;
  updated_time: string;
  effective_status: string;
}


export interface AdSet {
  id: string;
  name: string;
  daily_budget: string;
  lifetime_budget: string;
  start_time: string; 
  status: string;
  optimization_goal: string;
  platform: string;
  targeting: Targeting;
}

export interface Targeting {
  age_max: number;
  age_min: number;
  flexible_spec: FlexibleSpec[];
  geo_locations: GeoLocations;
  brand_safety_content_filter_levels?: string[];
  targeting_automation?: TargetingAutomation;
  publisher_platforms: string[];
  facebook_positions: string[];
  instagram_positions: string[];
  device_platforms: string[];
  locales?: number[];
}

export interface FlexibleSpec {
  work_employers?: AudienceItem[];
  work_positions?: AudienceItem[];
  interests?: AudienceItem[];
  behaviors?: AudienceItem[];
}

export interface AudienceItem {
  id: string;
  name: string;
}

export interface GeoLocations {
  custom_locations?: CustomLocation[];
  location_types?: string[];
}

export interface CustomLocation {
  distance_unit: string;  
  latitude: number;
  longitude: number;
  radius: number;
  primary_city_id: number;
  region_id: number;
  country: string;
}

export interface TargetingAutomation {
  advantage_audience: number;
  individual_setting: {
    geo: number;
    [key: string]: number;
  };
}


export interface Ad {
  id: string;
  name: string;
  status: string;
  adset_id: string;
  campaign_id: string;
  platform: string;
  creative: { id: string;};
  creativeDetails: {
    object_story_spec: object; 
    effective_object_story_id: string;
    id: string;
  };
  insights: {
    impressions: string;
    clicks: string;
    spend: string;
    ctr: string;
    date_start: string;
    date_stop: string;
  } | null;
  leads: object[]; 
}
