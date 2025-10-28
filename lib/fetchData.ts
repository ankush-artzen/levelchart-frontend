interface Props {
  url: string;
  method: string;
  payLoad: any;
}

export const fetchApi = async ({ url, method, payLoad }: Props) => {
  const response = await fetch(`${url}`, {
    method,
    headers: {
      Authorization: "",
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(payLoad),
  });
  return await response.json();
};
