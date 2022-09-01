(() => {
	const upstream = 'va2-test-hbobid.pubmatic.com';
	const upstream_path = '/';
	const https = true;
  
	addEventListener("fetch", (event) => {
	  event.respondWith(handleRequest(event.request));
	});
  
	function urlConfig(request) {
	  let url = new URL(request.url);
	  url.protocol = https === true ? 'https:' : 'http:';
	  url.host = upstream;
	  url.pathname = url.pathname === '/' ? upstream_path : (upstream_path + url.pathname);
	  return url
	}
  
	function formatResponseHeaders(response, origin) {
	  let new_response_headers = new Headers(response.headers);
	  const conn = new_response_headers.get('connection');
	  const contentEncoding = new_response_headers.get('content-encoding');
	  const trEncoding = new_response_headers.get('transfer-encoding');
	  new_response_headers.set('access-control-allow-origin', origin);
	  new_response_headers.set('access-control-allow-credentials', true);
	  new_response_headers.set('connection', conn);
	  new_response_headers.set('content-encoding', contentEncoding);
	  new_response_headers.set('transfer-encoding', trEncoding);
	  return new_response_headers;
	}
	
	async function handleRequest(request) {
	  const url = urlConfig(request);
	  const method = request.method;
	  const request_headers = request.headers;
	  let new_request_headers = new Headers(request_headers);
	  const origin = new_request_headers.get('origin');
	  new_request_headers.set('Host', upstream);
  
	  const original_response = await fetch(url.href+'translator?source=ow-client', {
		  method: method,
		  headers: new_request_headers,
		  body: JSON.stringify(await request.json())
	  })
  
	  const new_response_headers = formatResponseHeaders(original_response, origin);  
	  
	  return new Response(await original_response.text(), {
		  status: original_response.status,
		  headers: new_response_headers
	  })
	}
  })();
  //# sourceMappingURL=index.js.map
  