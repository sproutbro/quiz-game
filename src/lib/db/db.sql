UPDATE
    avatar
SET
    hair_style = $1,
    clothing = $2,
    accessories = $3,
    skin_tone = $4,
    updated_at = CURRENT_TIMESTAMP
WHERE
    provider = $5
    AND provideraccountid = $6;