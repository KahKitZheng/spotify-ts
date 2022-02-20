export type ExplicitContent = {
  filter_enabled: boolean;
  filter_locked: boolean;
};

export type ExternalUrls = {
  spotify: string;
};

export type Followers = {
  href: string | null;
  total: number;
};

export type User = {
  country?: string;
  display_name: string;
  email?: string;
  explicit_content?: ExplicitContent;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: SpotifyImage[];
  product?: string;
  type: string;
  uri: string;
};

export type SpotifyImage = {
  url: string;
  height: number;
  width: number;
};
