const extrapolate = (phoneCoord, phoneResolution, CompResolution) => ({
  x: (phoneCoord.x / phoneResolution.width) * CompResolution.width,
  y: (phoneCoord.y / phoneResolution.height) * CompResolution.height,
});

module.exports = extrapolate;
