import db from "./connection.js";

let current_path = "$lib/db/queries";

export async function selectAccount(params) {
  console.log({ current_path }, selectAccount);

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
  console.log("result", { account: !!result.rows[0] });
  return result.rows[0];
}

export async function insertAccount(params) {
  console.log({ current_path }, insertAccount);

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
  console.log({ current_path }, selectAvatar);

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

  console.log("result", { avatar: !!result.rows[0] });
  return result.rows[0];
}

export async function insertAvatar(params) {
  console.log({ current_path }, insertAvatar);

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
  console.log({ current_path }, updateAvatar);
  const SQL = `
    UPDATE
        avatar
    SET
        hair = $1,
        clothing = $2,
        accessories = $3,
        skin = $4,
        updated_at = CURRENT_TIMESTAMP
    WHERE
        provider = $5
        AND provideraccountid = $6;
    `;

  const result = await db.query(SQL, params);
  console.log({ rowCount: result.rowCount });
  return result.rowCount;
}

export async function selectProfile(params) {
  console.log({ current_path }, selectProfile);
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
  console.log({ current_path }, insertProfile);

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
  console.log({ current_path }, updateProfile);

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
  console.log({ current_path }, selectScore);
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
  console.log({ current_path }, insertScore);
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
  console.log({ current_path }, updateScore);
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
