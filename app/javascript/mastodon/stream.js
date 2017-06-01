export default function getStream(streamingAPIBaseURL, accessToken, stream, { connected, received, disconnected, reconnected }) {
  if (process.env.NODE_ENV === 'precompile') {
    return null; // no web sockets when using React SSR
  }

  const WebSocketClient = require('websocket.js');

  const ws = new WebSocketClient(`${streamingAPIBaseURL}/api/v1/streaming/?access_token=${accessToken}&stream=${stream}`);

  ws.onopen      = connected;
  ws.onmessage   = e => received(JSON.parse(e.data));
  ws.onclose     = disconnected;
  ws.onreconnect = reconnected;

  return ws;
};
