export const Roles = {
  Administrator: 'Administrator',
  Optician: 'Optician',
  Designer: 'Designer',
  HR: 'HR',
  User: 'User'
};

export const RolesLabel = {
  Administrator: 'Adminisztrátor',
  Optician: 'Optikus',
  Designer: 'Designer'
};

export const defaultRole = () => {
  return Roles.User;
};

export const allRoles = () => {
  return Object.keys(Roles).map(x => Roles[x]);
};
