let tempURL = new URL(window.location.toString())
let serverURL = tempURL.origin + '/';

export async function postBody(command: string, body: object): Promise<Response> {
  const url = serverURL + command + "/";
  let result = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  });

  return result;
}

export async function postEmpty(command: string): Promise<any> {
  let result = null
  try {
    result = await postBody(command, {});
    result = await result.json();  
  } catch(err){
    return null;
  }

  return result;
}

export async function postFormData(command: string, data: object): Promise<object> {
  let formData = new FormData();

  for (let [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }

  const url = serverURL + command + "/";

  let result = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  result = await result.json();
  return result;
}

export function getId(): string {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return Math.random().toString(36).substr(2, 9);
};