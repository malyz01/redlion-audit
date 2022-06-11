export const hasNoNav = (route: string) => {
  if (!route) return true;
  const paths = ['auth'];
  const [, path] = route.split('/');
  return paths.includes(path);
};
