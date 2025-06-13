export const tokens = {
  LAUNCHCOIN: 'Ey59PH7Z4BFU4HjyKnyMdWt5GGN76KazTAwQihoUXRnk',
  BUDDY: '4nor6joBE27cv6GQ7nnrAcSL7yQ6H8sKhbM7ctJDmhrN',
  GLMPS: 'AuHTkQ1H9ouMsTMoYqU9QCCsSsGnRXkt9PoBu3ykWKtK',
  PCULE: 'J27UYHX5oeaG1YbUGQc8BmJySXDjNWChdGB2Pi2TMDAq',
  DUPE: 'fRfKGCriduzDwSudCwpL7ySCEiboNuryhZDVJtr1a1C',
  KLED: '1zJX5gRnjLgmTpq5sVwkq69mNDQkCemqoasyjaPW6jm',
  MOBY: 'Cy1GS2FqefgaMbi45UunrUzin1rfEmTUYnomddzBpump',
  WONDER: 'GEKjZKJZgQTCbi9evTW2GmhyamH3sq6Lid9dQMWqEcCY',
  BUIDL: '3HfLqhtF5hR5dyBXh6BMtRaTm9qzStvEGuMa8Gx6pump',
  AIXBC: 'Hefh4Yv3cUGstf7wvEFPuKY7zAEhPxAvgZaoQnytW8md',
  SLSH: '2enpSQzqEaouvWJNpPSbVxmWFqA15j2n18vYeFpFKxfp',
  DTR: 'FkqvTmDNgxgcdS7fPbZoQhPVuaYJPwSsP8mm4p7oNgf6',
  OCTO: '4CoTCzobYt38zVbSieZxcmz2CCs8kmZJ6wnbj8HWocto',
  FITCOIN: 'Cr2mM4szbt8286XMn7iTpY5A8S17LbGAu1UyodkyEwn4',
  TCM: '28PgAVUab53W26qgu3TfffsxHF2rAFf1zvJJzE3Kdaos',
};

// 'synergy',
//   'apex',
//   'aurora',
//   'catalyst',
//   'horizon',
//   'orandis',
//   'phoenix',
//   'pulse',
//   'solaris',
export const TOKENS = [
  {
    address: 'Ey59PH7Z4BFU4HjyKnyMdWt5GGN76KazTAwQihoUXRnk',
    name: 'LAUNCHCOIN',
    icon: 'synergy',
  },

  {
    name: 'BUDDY',
    address: '4nor6joBE27cv6GQ7nnrAcSL7yQ6H8sKhbM7ctJDmhrN',
    icon: 'aurora',
  },
  {
    name: 'GLMPS',
    address: 'AuHTkQ1H9ouMsTMoYqU9QCCsSsGnRXkt9PoBu3ykWKtK',
    icon: 'apex',
  },
  {
    name: 'PCULE',
    address: 'J27UYHX5oeaG1YbUGQc8BmJySXDjNWChdGB2Pi2TMDAq',
    icon: 'catalyst',
  },
  {
    name: 'DUPE',
    address: 'fRfKGCriduzDwSudCwpL7ySCEiboNuryhZDVJtr1a1C',
    icon: 'horizon',
  },
  {
    name: 'KLED',
    address: '1zJX5gRnjLgmTpq5sVwkq69mNDQkCemqoasyjaPW6jm',
    icon: 'pulse',
  },
  {
    name: 'MOBY',
    address: 'Cy1GS2FqefgaMbi45UunrUzin1rfEmTUYnomddzBpump',
    icon: 'solaris',
  },
  {
    name: 'WONDER',
    address: 'GEKjZKJZgQTCbi9evTW2GmhyamH3sq6Lid9dQMWqEcCY',
    icon: 'apex',
  },
  {
    name: 'BUIDL',
    address: '3HfLqhtF5hR5dyBXh6BMtRaTm9qzStvEGuMa8Gx6pump',
    icon: 'orandis',
  },
  {
    name: 'AIXBC',
    address: 'Hefh4Yv3cUGstf7wvEFPuKY7zAEhPxAvgZaoQnytW8md',
    icon: 'phoenix',
  },
  {
    name: 'SLSH',
    address: '2enpSQzqEaouvWJNpPSbVxmWFqA15j2n18vYeFpFKxfp',
    icon: 'pulse',
  },
  {
    name: 'DTR',
    address: 'FkqvTmDNgxgcdS7fPbZoQhPVuaYJPwSsP8mm4p7oNgf6',
    icon: 'catalyst',
  },
  {
    name: 'OCTO',
    address: '4CoTCzobYt38zVbSieZxcmz2CCs8kmZJ6wnbj8HWocto',
    icon: 'solaris',
  },
  {
    name: 'FITCOIN',
    address: 'Cr2mM4szbt8286XMn7iTpY5A8S17LbGAu1UyodkyEwn4',
    icon: 'synergy',
  },
  {
    name: 'TCM',
    address: '28PgAVUab53W26qgu3TfffsxHF2rAFf1zvJJzE3Kdaos',
    icon: 'apex',
  },
];

export const getTokenFromAddress = (address: string) => {
  return TOKENS.find((token) => token.address === address);
};

export const addressToToken = (address: string) => {
  return Object.keys(tokens).find(
    (key) => tokens[key as keyof typeof tokens] === address,
  );
};
