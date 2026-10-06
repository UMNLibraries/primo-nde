interface Env {
  DB: D1Database;
  CF_PAGES_BRANCH?: string;
}

function getCorsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get('Origin') ?? '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
  };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const corsHeaders = getCorsHeaders(request);

  // const branch = env.CF_PAGES_BRANCH || 'main';
  // if (branch !== 'main' && branch !== 'production') {
  //   return new Response(null, { status: 204, headers: corsHeaders });
  // }

  const hostAppUrl =
    request.headers.get('Origin') ?? request.headers.get('Referer');
  if (!hostAppUrl) {
    return new Response('Missing Origin or Referer header', {
      status: 400,
      headers: corsHeaders,
    });
  }

  const hostAppDomain = new URL(hostAppUrl).hostname;
  const remoteModuleDomain = new URL(request.url).hostname;

  // Asynchronous D1 write
  context.waitUntil(
    env.DB.prepare(
      `INSERT INTO host_telemetry (remote_domain, host_domain) VALUES (?, ?)`,
    )
      .bind(remoteModuleDomain, hostAppDomain)
      .run()
      .catch((err) => console.error('Failed to insert host log into D1:', err)),
  );

  return new Response(null, { status: 204, headers: corsHeaders });
};
