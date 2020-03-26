export const Roles = {
  Administrator: 'Administrator',
  Optician: 'Optician',
  Designer: 'Designer'
};

export const RolesLabel = {
  Administrator: 'Adminisztrátor',
  Optician: 'Optikus',
  Designer: 'Designer'
};

export const allRoles = () => {
  return Object.keys(Roles).map(x => Roles[x]);
};
