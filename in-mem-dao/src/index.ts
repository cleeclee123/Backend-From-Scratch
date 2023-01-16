import fetch from "node-fetch";

const getUsers = async () => {
  const config = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  let res = await fetch(`http://localhost:3000/users/rFJMB2fjp`, config);
  console.log(await res.json());
};

const makeUser = async () => {
  const config = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName: "Clee",
    }),
  };
  let res = await fetch(`http://localhost:3000/users/rFJMB2fjp`, config);
  console.log(await res.json());
};

const deleteUser = async () => {
  const config = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  let res = await fetch(`http://localhost:3000/users/rFJMB2fjp`, config);
  console.log(await res.json());
};

console.log(await deleteUser());
