export const fetchUsers = async () => {
  const res = await fetch("http://localhost:3001/users");
  const data = await res.json();
  return data;
};
