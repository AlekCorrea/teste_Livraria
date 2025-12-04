// frontend/src/services/livrosService.js
import api from './api';

export const livrosService = {
  async listar() {
    const response = await api.get('/livros');
    return response.data;
  },

  async buscarPorId(id) {
    const response = await api.get(`/livros/${id}`);
    return response.data;
  },

async criar(formData) {
  return api.post('/livros', formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }).then(r => r.data);
},

async atualizar(id, formData) {
  return api.put(`/livros/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }).then(r => r.data);
},


  async remover(id) {
    const response = await api.delete(`/livros/${id}`);
    return response.data;
  }
};