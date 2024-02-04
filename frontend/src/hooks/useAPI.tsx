export function useAPI() {
  const API_URL = "http://localhost:3000";

  function sendRequest(
    route: string,
    method: string,
    body?: any,
    token?: string
  ) {
    return fetch(API_URL + route, {
      method,
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error(
            `Request failed with status ${res.status}: ${res.statusText}`
          );
        }
        return res.json();
      })
      .catch((error) => {
        console.error("Error:", error);
        return Promise.reject(error);
      });
  }

  function delay(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  return { sendRequest, delay };
}
