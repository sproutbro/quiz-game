import db from "./connection.js";

let file = "queries.js";

export async function selectAccount(params) {
  console.log({ file }, selectAccount);

  const SQL = `
    SELECT
        *
    FROM
        account
    WHERE
        provider = $1
        AND provideraccountid = $2;
    `;
  const result = await db.query(SQL, params);
  console.log({ account: !!result.rows[0] });
  return result.rows[0];
}

export async function insertAccount(params) {
  console.log({ file }, insertAccount);

  const SQL = `
    INSERT INTO
        account
    VALUES
        ($1, $2);
    `;

  const result = await db.query(SQL, params);
  console.log({ rowCount: result.rowCount });
}

export async function selectAvatar(params) {
  console.log({ file }, selectAvatar);

  const SQL = `
    SELECT
        hair,
        clothing,
        accessories,
        skin
    FROM
        avatar
    WHERE
        provider = $1
        AND provideraccountid = $2;
    `;
  const result = await db.query(SQL, params);
  const avatar = result.rows[0];
  console.log({ avatar: !!avatar });
  return avatar;
}
export async function insertAvatar(params) {
  console.log({ file }, insertAvatar);

  const SQL = `
    INSERT INTO
        avatar
    VALUES
        ($1, $2);
    `;
  const result = await db.query(SQL, params);
  console.log({ rowCount: result.rowCount });
}

export async function updateAvatar(params) {
  console.log({ file }, updateAvatar);
  const SQL = `
    UPDATE
        avatar
    SET
        hair = $1,
        clothing = $2,
        accessories = $3,
        skin = $4
    WHERE
        provider = $5
        AND provideraccountid = $6;
    `;

  const result = await db.query(SQL, params);
  console.log({ rowCount: !!result.rowCount });
  return result.rowCount;
}

export async function selectProfile(params) {
  console.log({ file }, selectProfile);
  const SQL = `
  SELECT
      *
  FROM
      profile
  WHERE
      provider = $1
      AND provideraccountid = $2;
  `;
  const result = await db.query(SQL, params);

  console.log({ profile: !!result.rows[0] });
  return result.rows[0];
}

export async function insertProfile(params) {
  console.log({ file }, insertProfile);

  const SQL = `
  INSERT INTO
      profile
  VALUES
      ($1, $2, $3) RETURNING nickname;
  `;
  const result = await db.query(SQL, params);
  const profile = result.rows[0];
  console.log("result", { profile: !!profile });
  return profile;
}

export async function updateProfile(params) {
  console.log({ file }, updateProfile);

  const SQL = `
    UPDATE
        profile
    SET
        nickname = $1
    WHERE
        provider = $2
        AND provideraccountid = $3 RETURNING nickname;
    `;
  const result = await db.query(SQL, params);
  const profile = result.rows[0];
  console.log({ profile: !!profile });
  return profile;
}

export async function selectScore(params) {
  console.log({ file }, selectScore);
  const SQL = `
    SELECT
        math
    FROM
        score
    WHERE
        provider = $1
        AND provideraccountid = $2;
    `;
  const result = await db.query(SQL, params);
  const score = result.rows[0];
  console.log({ score: !!score });
  return score;
}

export async function insertScore(params) {
  console.log({ file }, insertScore);
  const SQL = `
    INSERT INTO
        score
    VALUES
        ($1, $2) RETURNING *;
    `;
  const result = await db.query(SQL, params);

  console.log({ rowCount: !!result.rowCount });
  return result.rowCount;
}

export async function updateScore(params) {
  console.log({ file }, updateScore);
  const SQL = `
    UPDATE
        score
    SET
        math = $1
    WHERE
        provider = $2
        AND provideraccountid = $3 RETURNING math;
    `;
  const result = await db.query(SQL, params);
  const score = result.rows[0];
  console.log("result:", { score: !!score });
  return score;
}

export default {
  updateScore,
  insertScore,
  selectScore,
  updateProfile,
  insertProfile,
  selectProfile,
  selectAccount,
  insertAccount,
  selectAvatar,
  insertAvatar,
  updateAvatar,
};
