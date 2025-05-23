import axios, { AxiosRequestConfig } from "axios";


export interface Response<T> {
  count: number;
  next: string | null;
  results: T[];
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL+import.meta.env.VITE_API_PORT_PRODUCT,
  // params: {
  //   key: import.meta.env.VITE_API_KEY,
  // },
});

class ApiClient<T> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

 getAll = (config?: AxiosRequestConfig) =>
  axiosInstance.get<T[]>(this.endpoint, config).then((res) => res.data);

  get = (id: number | string) =>
    axiosInstance.get<T>(this.endpoint + "/" + id).then((res) => res.data);
  post = (data: Partial<T>, token?: string) =>
    axiosInstance.post<T>(this.endpoint, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).then((res) => res.data);

put = (id: number | string, data: Partial<T>, token?: string) =>
    axiosInstance.put<T>(`${this.endpoint}/${id}`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).then((res) => res.data);

  delete = (id: number | string, token?: string) =>
    axiosInstance.delete(`${this.endpoint}/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).then((res) => res.data);
}

export default ApiClient;


/*
  console.log("put", id, data)
  console.log("endpoint", this.endpoint)
  console.log("url", `${this.endpoint}/${id}`)*/