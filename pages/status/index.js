import useSWR from 'swr';

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();

  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <h2>Database</h2>
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { data, isLoading } = useSWR('/api/v1/status', fetchAPI, {
    refreshInterval: 2000,
  });

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  const updatedAtText = new Date(data.updated_at).toLocaleString('pt-BR');

  return <div>Last updated: {updatedAtText}</div>;
}

function DatabaseStatus() {
  const { data, isLoading } = useSWR('/api/v1/status', fetchAPI, {
    refreshInterval: 2000,
  });

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  const databaseData = data.dependencies.database;
  const databaseVersion = databaseData.version;
  const databaseOpenedConnections = databaseData.opened_connections;
  const databaseMaxConnections = databaseData.max_connections;

  return (
    <>
      <div>Version: {databaseVersion}</div>
      <div>Opened connections: {databaseOpenedConnections}</div>
      <div>Max connections: {databaseMaxConnections}</div>
    </>
  );
}
