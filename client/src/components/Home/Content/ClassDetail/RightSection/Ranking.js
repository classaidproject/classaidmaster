import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { rankingURL } from "../../../../../api";

function Ranking({ id }) {
  const [Ranking, setRanking] = useState([]);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(rankingURL(id))
      .then((res) => {
        setRanking(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err.response));
  }, []);

  return (
    <div className="user-container">
      {Loading ? (
        "LOADING"
      ) : (
        <>
          <h3>Owners</h3>
          <ul className="row head">
            <li>Name</li>
            <li>Email</li>
            <li>Score</li>
          </ul>

          {Ranking.map((user) => (
            <ul className="row">
              <li>{user.user}</li>
              <li>{user.email}</li>
              <li>{user.score}</li>
            </ul>
          ))}
        </>
      )}
    </div>
  );
}

export default Ranking;
