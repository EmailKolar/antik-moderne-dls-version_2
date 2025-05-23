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
  post = (data: Partial<T>) =>
  axiosInstance.post<T>(this.endpoint, data).then((res) => res.data);

put = (id: number | string, data: Partial<T>) =>
  axiosInstance.put<T>(`${this.endpoint}/${id}`, data).then((res) => res.data);

delete = (id: number | string) =>
  axiosInstance.delete(`${this.endpoint}/${id}`).then((res) => res.data);
}

export default ApiClient;