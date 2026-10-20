export type UserStatus = 'active' | 'invited' | 'suspended';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  projects: number;
  joined: Date;
}

const first = ['Ada', 'Grace', 'Linus', 'Margaret', 'Alan', 'Barbara', 'Ken', 'Radia', 'Tim', 'Frances', 'Dennis', 'Katherine', 'Guido', 'Hedy', 'John', 'Annie', 'Bjarne', 'Shafi', 'Donald', 'Sophie', 'Edsger', 'Lynn', 'Vint', 'Joan'];
const last = ['Lovelace', 'Hopper', 'Torvalds', 'Hamilton', 'Turing', 'Liskov', 'Thompson', 'Perlman', 'Berners-Lee', 'Allen', 'Ritchie', 'Johnson', 'van Rossum', 'Lamarr', 'McCarthy', 'Easley', 'Stroustrup', 'Goldwasser', 'Knuth', 'Wilson', 'Dijkstra', 'Conway', 'Cerf', 'Clarke'];
const roles = ['Admin', 'Editor', 'Viewer', 'Developer', 'Designer'];
const statuses: UserStatus[] = ['active', 'active', 'active', 'invited', 'suspended'];

export const USERS: User[] = first.map((f, i) => ({
  id: i + 1,
  name: `${f} ${last[i]}`,
  email: `${f.toLowerCase()}.${last[i].toLowerCase().replace(/[^a-z]/g, '')}@example.com`,
  role: roles[(i * 7) % roles.length],
  status: statuses[(i * 3) % statuses.length],
  projects: (i * 13) % 29,
  joined: new Date(2021, (i * 5) % 12, ((i * 11) % 27) + 1),
}));
