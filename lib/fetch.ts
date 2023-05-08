export async function post(url: string, params: object) {
  if (url.startsWith('./')) {
    url.slice(1);
    url = `api/${url}`;
  }

  const data = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  return { data: await data.json(), status: data.status };
}

export async function get(url: string) {
  if (url.startsWith('./')) {
    url.slice(1);
    url = `api/${url}`;
  }

  const data = await fetch(url);
  return { data: await data.json(), status: data.status };
}

export function fetcherSWT(url) {
  return fetch(url).then((r) => r.json());
}
