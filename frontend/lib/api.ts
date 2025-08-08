import { AxiosResponse } from 'axios';
import apiClient from './apiClient';

export type Event = {
  id: string;
  title: string;
  starts_at: string;
  location: string;
  description?: string;
};

export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface Login {
  user : User;
  token : string;
};




export const eventsApi = {
  list: (search?: string) => apiClient.get<AxiosResponse<Event[]>>('events', { params: search ? { search } : undefined }),

  get: (id: string) => apiClient.get<{ event: Event , is_registered : boolean }>(`events/${id}`),

  getPopular: (number?: number) => apiClient.get<AxiosResponse<Event[]>>(`events/popular`),

  getUpcoming: (number?: number) => apiClient.get<AxiosResponse<Event[]>>(`events/upcoming`),

  create: (payload: Omit<Event, 'id'>) => apiClient.post<AxiosResponse<Event>>('events', payload),

  update: (id: string, payload: Partial<Omit<Event, 'id'>>) => apiClient.put<AxiosResponse<Event>>(`events/${id}`, payload),

  delete: (id: string) => apiClient.delete<void>(`events/${id}`),

  getUserEvent: () => apiClient.get<AxiosResponse<Event[]>>(`user/events`),

  register: (id : string) => apiClient.post<{ data: Event }>(`events/${id}/register`),

  notify: (message : string) => apiClient.post<{ data: Event }>(`notify`, {message}),

};

export const authApi = {
  login: (email: string, password: string) => apiClient.post<Login>('login', { email, password, }),

  register: (data: { name: string; email: string; password: string }) =>apiClient.post<Login>('register', data),
  
  logout: () => apiClient.post('logout'),
};
