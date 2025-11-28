export interface Memorial {
  id: string;
  name: string;
  birth_date: string | null;
  death_date: string | null;
  description: string | null;
  owner_id: string;
}

export interface Memory {
  id: string;
  memorial_id: string;
  title: string;
  content: string;
  media_url: string | null;
  created_at: string;
}

export interface QRLink {
  token: string;
  memorial_id: string;
  expires_at: string | null;
}
