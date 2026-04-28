// Enkel tilgangskode-sjekk – koden lagres i miljøvariabelen ACCESS_CODE
exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (!process.env.ACCESS_CODE) {
    // Ingen kode konfigurert – la alle gjennom
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ ok: true }) };
  }

  try {
    const { code } = JSON.parse(event.body || '{}');
    const ok = code && code.trim() === process.env.ACCESS_CODE.trim();
    return {
      statusCode: ok ? 200 : 401,
      headers: corsHeaders,
      body: JSON.stringify({ ok })
    };
  } catch {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ ok: false, error: 'Ugyldig forespørsel' }) };
  }
};
