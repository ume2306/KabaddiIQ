export const playerZones = [
  {
    name: "Naveen Kumar",
    team: "Dabang Delhi KC",
    position: "Raider",
    attackZones: [
      { zone: "Left Corner", strength: 91, raids: 148, successRate: 73 },
      { zone: "Left Cover", strength: 78, raids: 112, successRate: 64 },
      { zone: "Left In", strength: 61, raids: 67, successRate: 51 },
      { zone: "Right In", strength: 44, raids: 38, successRate: 38 },
      { zone: "Right Cover", strength: 29, raids: 21, successRate: 24 },
      { zone: "Right Corner", strength: 18, raids: 11, successRate: 14 },
    ],
    preferredStyle: "Ankle Hold",
    dominantZone: "Left Corner",
    weakZone: "Right Corner",
  },
  {
    name: "Fazel Atrachali",
    team: "UP Yoddhas",
    position: "Defender",
    attackZones: [
      { zone: "Left Corner", strength: 88, tackles: 201, successRate: 81 },
      { zone: "Right Corner", strength: 82, tackles: 178, successRate: 76 },
      { zone: "Left Cover", strength: 71, tackles: 134, successRate: 67 },
      { zone: "Right Cover", strength: 68, tackles: 121, successRate: 63 },
      { zone: "Left In", strength: 54, tackles: 89, successRate: 49 },
      { zone: "Right In", strength: 47, tackles: 72, successRate: 43 },
    ],
    preferredStyle: "Chain Tackle",
    dominantZone: "Left Corner",
    weakZone: "Right In",
  },
  {
    name: "Pardeep Narwal",
    team: "UP Yoddhas",
    position: "Raider",
    attackZones: [
      { zone: "Left In", strength: 84, raids: 167, successRate: 69 },
      { zone: "Right In", strength: 79, raids: 143, successRate: 65 },
      { zone: "Left Cover", strength: 71, raids: 118, successRate: 58 },
      { zone: "Right Cover", strength: 66, raids: 98, successRate: 54 },
      { zone: "Left Corner", strength: 48, raids: 61, successRate: 41 },
      { zone: "Right Corner", strength: 41, raids: 49, successRate: 35 },
    ],
    preferredStyle: "Dubki",
    dominantZone: "Left In",
    weakZone: "Right Corner",
  },
  {
    name: "Pawan Sehrawat",
    team: "Tamil Thalaivas",
    position: "Raider",
    attackZones: [
      { zone: "Right Corner", strength: 89, raids: 159, successRate: 75 },
      { zone: "Right Cover", strength: 76, raids: 124, successRate: 66 },
      { zone: "Right In", strength: 68, raids: 91, successRate: 58 },
      { zone: "Left In", strength: 52, raids: 63, successRate: 45 },
      { zone: "Left Cover", strength: 34, raids: 29, successRate: 28 },
      { zone: "Left Corner", strength: 21, raids: 14, successRate: 16 },
    ],
    preferredStyle: "Toe Touch",
    dominantZone: "Right Corner",
    weakZone: "Left Corner",
  },
  {
    name: "Arjun Deshwal",
    team: "Jaipur Pink Panthers",
    position: "Raider",
    attackZones: [
      { zone: "Left Cover", strength: 82, raids: 141, successRate: 70 },
      { zone: "Left Corner", strength: 74, raids: 119, successRate: 64 },
      { zone: "Left In", strength: 63, raids: 88, successRate: 55 },
      { zone: "Right In", strength: 51, raids: 67, successRate: 46 },
      { zone: "Right Cover", strength: 38, raids: 42, successRate: 32 },
      { zone: "Right Corner", strength: 26, raids: 23, successRate: 20 },
    ],
    preferredStyle: "Running Hand Touch",
    dominantZone: "Left Cover",
    weakZone: "Right Corner",
  },
];

export const teamZones = [
  {
    team: "Jaipur Pink Panthers",
    defensiveZones: [
      { zone: "Left Corner", tackleSuccess: 81, label: "Fortress" },
      { zone: "Right Corner", tackleSuccess: 44, label: "Weak" },
      { zone: "Left Cover", tackleSuccess: 67, label: "Moderate" },
      { zone: "Right Cover", tackleSuccess: 71, label: "Strong" },
      { zone: "Left In", tackleSuccess: 58, label: "Moderate" },
      { zone: "Right In", tackleSuccess: 38, label: "Weak" },
    ],
  },
  {
    team: "Bengaluru Bulls",
    defensiveZones: [
      { zone: "Left Corner", tackleSuccess: 62, label: "Moderate" },
      { zone: "Right Corner", tackleSuccess: 78, label: "Fortress" },
      { zone: "Left Cover", tackleSuccess: 44, label: "Weak" },
      { zone: "Right Cover", tackleSuccess: 69, label: "Strong" },
      { zone: "Left In", tackleSuccess: 71, label: "Strong" },
      { zone: "Right In", tackleSuccess: 51, label: "Moderate" },
    ],
  },
  {
    team: "Dabang Delhi KC",
    defensiveZones: [
      { zone: "Left Corner", tackleSuccess: 69, label: "Strong" },
      { zone: "Right Corner", tackleSuccess: 58, label: "Moderate" },
      { zone: "Left Cover", tackleSuccess: 38, label: "Weak" },
      { zone: "Right Cover", tackleSuccess: 72, label: "Strong" },
      { zone: "Left In", tackleSuccess: 55, label: "Moderate" },
      { zone: "Right In", tackleSuccess: 43, label: "Weak" },
    ],
  },
  {
    team: "UP Yoddhas",
    defensiveZones: [
      { zone: "Left Corner", tackleSuccess: 84, label: "Fortress" },
      { zone: "Right Corner", tackleSuccess: 79, label: "Fortress" },
      { zone: "Left Cover", tackleSuccess: 67, label: "Moderate" },
      { zone: "Right Cover", tackleSuccess: 63, label: "Moderate" },
      { zone: "Left In", tackleSuccess: 48, label: "Weak" },
      { zone: "Right In", tackleSuccess: 42, label: "Weak" },
    ],
  },
];

export const getPlayerZone = (name) =>
  playerZones.find((p) => p.name.toLowerCase().includes(name.toLowerCase()));

export const getTeamZone = (team) =>
  teamZones.find((t) => t.team.toLowerCase().includes(team.toLowerCase()));
