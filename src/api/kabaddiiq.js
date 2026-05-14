import axios from 'axios';

const BASE = 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE,
  timeout: 10000,
});

export const searchPlayers = async (query) => {
  const res = await api.get(`/players/search/${query}`);
  return res.data.results;
};

export const getPlayer = async (name) => {
  const res = await api.get(`/player/${encodeURIComponent(name)}`);
  return res.data;
};

export const getOpponent = async (team) => {
  const res = await api.get(`/opponent/${encodeURIComponent(team)}`);
  return res.data;
};

export const getTeams = async () => {
  const res = await api.get('/teams');
  return res.data.teams;
};

export const getH2H = async (raider, defender) => {
  const res = await api.get(
    `/h2h/${encodeURIComponent(raider)}/${encodeURIComponent(defender)}`
  );
  return res.data;
};

export const getLeagueOverview = async () => {
  const res = await api.get('/league/overview');
  return res.data;
};

export const getPlayerZone = async (name) => {
  const res = await api.get(`/zone/player/${encodeURIComponent(name)}`);
  return res.data;
};

export const sendChatMessage = async (message, history = []) => {
  const res = await api.post('/chat', {
    message,
    conversation_history: history,
  });
  return res.data;
};
