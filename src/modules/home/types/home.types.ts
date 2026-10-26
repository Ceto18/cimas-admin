export interface HomeBanner {
  id: number;
  name: string;
  image: string;
  order: number;
}

export interface HomeContent {
  title: string;
  subtitle: string;
  banners: HomeBanner[];
}