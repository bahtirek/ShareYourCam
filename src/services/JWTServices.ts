export const getPayload = (jwt: any) => {
  const arrayToken = jwt.split('.');
  const tokenPayload = JSON.parse(atob(arrayToken[1]));
  return tokenPayload
}

export const isTokenExpired = (jwt: any) => {
  const payload = getPayload(jwt);
  return Math.floor(new Date().getTime() / 1000) >= payload?.sub;
}

export const getSessionId = (jwt: any) => {
  const payload = getPayload(jwt);
  console.log(payload);
  
  return payload.session_id;
}