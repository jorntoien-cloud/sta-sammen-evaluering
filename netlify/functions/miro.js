// Proxy for Miro API – holder MIRO_TOKEN skjult på serveren
exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  const targetUrl = event.queryStringParameters && event.queryStringParameters.url;
  if (!targetUrl) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Mangler url-parameter' }) };
  }

  if (!process.env.MIRO_TOKEN) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'MIRO_TOKEN er ikke satt i miljøvariabler' }) };
  }

  try {
    const res = await fetch(targetUrl, {
      method: event.httpMethod === 'GET' ? 'GET' : event.httpMethod,
      headers: {
        'Authorization': `Bearer ${process.env.MIRO_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: event.httpMethod !== 'GET' ? event.body : undefined
    });

    const data = await res.text();
    return {
      statusCode: res.status,
      headers: corsHeaders,
      body: data
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message })
    };
  }
};
