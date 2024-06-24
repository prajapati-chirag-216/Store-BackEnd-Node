function setUserAccessTokenCookie(res, accessToken) {
  const accessTokenCookieOptions = {
    expires: new Date(Date.now() + 1000 * 60 * 5),
    httpOnly: true,
    sameSite: "None",
    secure: true,
  };
  res.cookie("userAccessToken", accessToken, accessTokenCookieOptions);
}

function setUserRefreshTokenCookie(res, refreshToken) {
  const refreshTokenCookieOptions = {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    httpOnly: true,
    sameSite: "None",
    secure: true,
  };
  res.cookie("userRefreshToken", refreshToken, refreshTokenCookieOptions);
}
module.exports = {
  setUserAccessTokenCookie,
  setUserRefreshTokenCookie,
};
