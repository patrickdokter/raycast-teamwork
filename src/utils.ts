export interface Preferences {
  accessToken: string;
  endpoint: string;
}

export interface TeamworkProject {
  id: string;
  name: string;
  logo: string;
}

export interface TeamworkPeople {
  avatarUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}