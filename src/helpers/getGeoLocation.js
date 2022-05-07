export async function getGeoLocation() {
  let latitude;
  let longitude;
  navigator.geolocation.getCurrentPosition(pos => {
    latitude = pos.coords.latitude;
    longitude = pos.coords.longitude;
    return { latitude, longitude };
  });
  console.log({ latitude, longitude });
  return { latitude, longitude };
}
