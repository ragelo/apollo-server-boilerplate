export interface AuthClient {
  id: string;
  secret: string;
}

const clients: AuthClient[] = [{
  id: 'test_client',
  secret: 'test_secret',
}];

export async function getAuthClient(id: string): Promise<AuthClient | undefined> {
  return clients.find(client => client.id === id);
}
