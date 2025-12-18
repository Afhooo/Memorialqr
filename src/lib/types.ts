export interface Memorial {
  id: string;
  name: string;
  birth_date: string | null;
  death_date: string | null;
  description: string | null;
  owner_id: string;
  cover_media_url?: string | null;
  cover_media_path?: string | null;
  avatar_media_url?: string | null;
  avatar_media_path?: string | null;
  template_id?: string | null;
}

export interface Memory {
  id: string;
  memorial_id: string;
  title: string;
  content: string;
  media_url: string | null;
  media_path?: string | null;
  created_at: string;
}

export interface QRLink {
  token: string;
  memorial_id: string;
  expires_at: string | null;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

export interface ServerSession {
  token: string;
  user: AdminUser;
}
