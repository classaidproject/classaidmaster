let users = [];

function addUser(id, userobject, room) {
  const index = users.findIndex((user) => user.id === id);
  let moveUser = null;
  if (index !== -1) {
    moveUser = users[index];
    deleteUser(id);
  }
  users.push({ id, userobject, room });

  return moveUser;
}

function deleteUser(id) {
  const index = users.findIndex((user) => user.id === id);
  const replica = users[index];
  users.splice(index, 1)[0];
  if (index !== -1) return replica;
  else return users;
}

function getUser(room) {
  let userInRoom = [];
  users.forEach((user) => {
    if (user.room === room) userInRoom.push(user.userobject);
  });
  return userInRoom;
}

function find(id) {
  const index = users.findIndex((user) => user.id === id);
  return users[index];
}

function allUser() {
  return users;
}

module.exports = { addUser, deleteUser, getUser, allUser, find };
