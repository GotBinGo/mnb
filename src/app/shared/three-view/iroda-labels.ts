const targyaloPostFix = 'tárgyaló';
const szobaPostFix = 'szoba';

const roomInfo = {
  WCAB: { mapLabel: 'WC', postFix: '(AB)' },
  WCCD: { mapLabel: 'WC', postFix: '(CD)' },
  WCEF: { mapLabel: 'WC', postFix: '(EF)' },
  C14: { mapLabel: 'Konyha', postFix: '(AB)' },
  C48: { mapLabel: 'Konyha', postFix: '(CD)' },
  C28: { mapLabel: 'Konyha', postFix: '(EF)' },

  C01: { mapLabel: 'Recepció', postFix: '' },
  C21: { mapLabel: 'Csocsó', postFix: szobaPostFix },
  C22: { mapLabel: 'Zuh.', postFix: '', fullName: 'Zuhanyzó' },
  C25: { mapLabel: 'SRV', postFix: '', fullName: 'Szerver szoba' },
  C26: { mapLabel: 'Pihi sarok', postFix: '' },

  C03: { mapLabel: 'Enterprise', postFix: targyaloPostFix, reservable: true },
  C04: { mapLabel: 'Discovery', postFix: targyaloPostFix, reservable: true },
  C05: { mapLabel: 'Atlantis', postFix: targyaloPostFix, reservable: true },
  C27: { mapLabel: 'Dragon', postFix: targyaloPostFix, reservable: true },
  C29: { mapLabel: 'Tardis', postFix: targyaloPostFix, reservable: true },
  C30: { mapLabel: 'Masat', postFix: targyaloPostFix, reservable: true },
  C44: { mapLabel: 'Falcon', postFix: targyaloPostFix, reservable: true },
  C45: { mapLabel: 'Voyager1', postFix: targyaloPostFix, reservable: true },
  C46: { mapLabel: 'Voyager2', postFix: targyaloPostFix, reservable: true }
};

export const isRoomReservable = (id: string) => {
  return roomInfo[id] && roomInfo[id].reservable;
};

export const getIrodaLabel = (id: string) => {
  return (roomInfo[id] && roomInfo[id].mapLabel) || id;
};

export const getRoomFullName = (id: string) => {
  const info = roomInfo[id];
  return (info && (info.fullName || `${info.mapLabel} ${info.postFix}`)) || `${id} ${szobaPostFix}`;
};

export const getIrodaCode = (name: string) => {
  const a = Object.keys(roomInfo).filter(x => (roomInfo[x].mapLabel || '').toLowerCase() === name);
  return a[0];
};
