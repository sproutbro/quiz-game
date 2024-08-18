import db from "./connection.js";

export async function selectFromAccount(provider, providerId, nickname) {
  const SQL = `
    SELECT
        nickname
    FROM
        account
    WHERE
        provider = $1
        AND provideraccountid = $2;
    `;
  let result = await db.query(SQL, [provider, providerId]);

  if (!result.rows[0]) {
    result = await registerNewPlayer(provider, providerId, nickname);
    await registerNewAvatar(provider, providerId);
    console.log("신규 플레이어 등록 :", result.rows[0]);
  }

  return result.rows[0];
}

async function registerNewPlayer(provider, providerId, nickname) {
  const SQL = `
    INSERT INTO
        account
    VALUES
        ($1, $2, $3) RETURNING nickname;
    `;
  return await db.query(SQL, [provider, providerId, nickname]);
}

async function registerNewAvatar(provider, providerId) {
  const SQL = `
    INSERT INTO
        avatar
    VALUES
        ($1, $2);
    `;
  return await db.query(SQL, [provider, providerId]);
}

export async function selectFromAvatar(provider, providerId) {
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
  const result = await db.query(SQL, [provider, providerId]);
  return result.rows[0];
}

export async function updateAvatar(params) {
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
  return result.rowCount;
}
