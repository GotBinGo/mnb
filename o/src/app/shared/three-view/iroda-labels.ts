const lables = {
  WCAB: 'AB WC',
  WCCD: 'CD WC',
  WCEF: 'EF WC',
  C29: 'Tardis',
  C30: 'Masat',
  C03: 'Enterprise',
  C04: 'Discovery',
  C05: 'Atlantis',
  C44: 'Falcon',
  C45: 'Voyager2',
  C46: 'Voyager1',
  C27: 'Dragon'
  // ...
};

export const getIrodaLabel = (id: string) => {
  return lables[id] || id;
};

export const getIrodaCode = (name: string) => {
  const a = Object.keys(lables).filter(x => (lables[x] as string).toLowerCase() === name);
  return a[0];
};
