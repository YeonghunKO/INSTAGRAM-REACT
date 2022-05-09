async function getGeoLocation() {
  return new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(res, rej);
  });
}

export async function getLocation() {
  const {
    coords: { latitude, longitude },
  } = await getGeoLocation();

  const locationData = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
  );

  const jsonLocationData = await locationData.json();
  const { countryName, principalSubdivision } = jsonLocationData;
  return {
    latitude,
    longitude,
    location: `${principalSubdivision},${countryName}`,
  };
}
